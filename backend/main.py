from fastapi import Cookie, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import requests
from fastapi.middleware.cors import CORSMiddleware
import logging
from pydantic import BaseModel
import jwt
from dotenv import load_dotenv
import os

app = FastAPI()
logger = logging.getLogger(__name__)

# Configure logging to show more details
logging.basicConfig(level=logging.INFO)

# Allow CORS for your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://services.cialabs.org","*" ],  # Frontend domain
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Casdoor Configuration
load_dotenv()
CASDOOR_API_URL = os.getenv("CASDOOR_API_URL")
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

def get_access_token(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is missing or expired")
    try:
        # Decode the token to get the user information
        decoded_token = jwt.decode(access_token, options={"verify_signature": False})
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid access token")

@app.post("/api/token")
async def exchange_token(request: Request):
    
    try:
        # Extract the 'code' from the request body
        body = await request.json()
        token_request_code = body.get("code")

        if not token_request_code:
            raise HTTPException(status_code=400, detail="Authorization code not provided")

        # Casdoor token exchange URL
        token_url = f"{CASDOOR_API_URL}/login/oauth/access_token"

        # Prepare query parameters for the request
        params = {
            "grant_type": "authorization_code",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": token_request_code,
            "redirect_uri": REDIRECT_URI,
        }

        logging.info(f"Sending request to Casdoor with params: {params}")

        # Send the request to Casdoor for token exchange
        token_response = requests.post(token_url, data=params)

        # If the request was unsuccessful, return an error response
        if token_response.status_code != 200:
            error_data = token_response.json()
            return JSONResponse(
                status_code=400,
                content={
                    "error": error_data.get("error", "Unknown error"),
                    "error_description": error_data.get("error_description", "No description available"),
                },
            )

        # Parse the JSON response from Casdoor to get the access token
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        print("here1",access_token)
        decoded_token=jwt.decode(access_token, options={"verify_signature":False})
        print("here2", decoded_token)
        
        

        # If no access token is returned, raise an error
        if not access_token:
            logging.error("No access token received from Casdoor")
            raise HTTPException(status_code=400, detail="No access token received")

        # Return the token as a response (optional)
        return JSONResponse(content={"access_token": access_token})

    except Exception as e:
        # Catch any unexpected errors
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")



@app.get("/api/user-details")
async def get_user_details(
    user_id: str,
    access_token: str = Cookie(default=None),  # Extract `access_token` from cookies
):
    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Access token is not available. Please authenticate first."
        )

    try:
        # Decode the token (ensure jwt-decode logic is available if needed)
        decoded_token = jwt.decode(access_token, options={"verify_signature": False})

        # Check if the provided `user_id` matches the decoded token's user ID
        if user_id != decoded_token.get("id"):
            raise HTTPException(
                status_code=401,
                detail="Invalid user ID or access token. Something fishy."
            )

        # print("Token in user details is:", access_token)
        param_id = f"{decoded_token.get('owner')}/{decoded_token.get('name')}"
        # print(param_id)
        
        # Make the API call to Casdoor
        response = requests.get(
            f"{CASDOOR_API_URL}/get-user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            params={"id": param_id},
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json()
            )

        # Parse and return the user data
        users_data = response.json()
        # print(users_data)
        return JSONResponse(content=users_data)
        
    except Exception as e:
        logging.error(f"Error fetching user details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch user details.")



@app.post("/generate-keys")
async def generate_keys(user_id: str, request: Request):
    # Retrieve the access token from cookies
    access_token = request.cookies.get("access_token")
   
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is not available. Please authenticate first.")

    # Decode or validate the token here (e.g., using JWT library)
    try:
        decoded_token = jwt.decode(access_token, options={"verify_signature": False})  # Replace with actual decoding function
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    
    if user_id != decoded_token.get("id"):
        raise HTTPException(status_code=401, detail="User ID does not match the token.")

    try:
        # Prepare param_id for Casdoor API call
        param_id = f"{decoded_token.get('owner')}/{decoded_token.get('name')}"
        
        # Make the API call to Casdoor to get user data
        response = requests.get(
            f"{CASDOOR_API_URL}/get-user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            params={"id": param_id},
        )

        # Handle Casdoor response
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())

        # Parse user data from Casdoor response
        user_data = response.json()
        
        # Prepare payload for Casdoor API call to generate keys
        casdoor_payload = {
    "owner": user_data.get("data", {}).get("owner", ""),
    "name": user_data.get("data", {}).get("name", ""),
    "createdTime": user_data.get("data", {}).get("createdTime", ""),
    "accessKey": user_data.get("data", {}).get("accessKey", ""),
    "accessSecret": user_data.get("data", {}).get("accessSecret", ""),
    "accessToken": user_data.get("data", {}).get("accessToken", ""),
    "address": user_data.get("data", {}).get("address", []),
    "adfs": user_data.get("data", {}).get("adfs", ""),
    "affiliation": user_data.get("data", {}).get("affiliation", ""),
    "alipay": user_data.get("data", {}).get("alipay", ""),
    "amazon": user_data.get("data", {}).get("amazon", ""),
    "apple": user_data.get("data", {}).get("apple", ""),
    "auth0": user_data.get("data", {}).get("auth0", ""),
    "avatar": user_data.get("data", {}).get("avatar", ""),
    "avatarType": user_data.get("data", {}).get("avatarType", ""),
    "azuread": user_data.get("data", {}).get("azuread", ""),
    "azureadb2c": user_data.get("data", {}).get("azureadb2c", ""),
    "baidu": user_data.get("data", {}).get("baidu", ""),
    "balance": user_data.get("data", {}).get("balance", 0),
    "battlenet": user_data.get("data", {}).get("battlenet", ""),
    "bilibili": user_data.get("data", {}).get("bilibili", ""),
    "bio": user_data.get("data", {}).get("bio", ""),
    "birthday": user_data.get("data", {}).get("birthday", ""),
    "bitbucket": user_data.get("data", {}).get("bitbucket", ""),
    "box": user_data.get("data", {}).get("box", ""),
    "casdoor": user_data.get("data", {}).get("casdoor", ""),
    "cloudfoundry": user_data.get("data", {}).get("cloudfoundry", ""),
    "countryCode": user_data.get("data", {}).get("countryCode", "US"),
    "createdIp": user_data.get("data", {}).get("createdIp", ""),
    "currency": user_data.get("data", {}).get("currency", ""),
    "custom": user_data.get("data", {}).get("custom", ""),
    "dailymotion": user_data.get("data", {}).get("dailymotion", ""),
    "deezer": user_data.get("data", {}).get("deezer", ""),
    "deletedTime": user_data.get("data", {}).get("deletedTime", ""),
    "digitalocean": user_data.get("data", {}).get("digitalocean", ""),
    "dingtalk": user_data.get("data", {}).get("dingtalk", ""),
    "discord": user_data.get("data", {}).get("discord", ""),
    "displayName": user_data.get("data", {}).get("displayName", ""),
    "douyin": user_data.get("data", {}).get("douyin", ""),
    "dropbox": user_data.get("data", {}).get("dropbox", ""),
    "education": user_data.get("data", {}).get("education", ""),
    "email": user_data.get("data", {}).get("email", ""),
    "emailVerified": user_data.get("data", {}).get("emailVerified", False),
    "eveonline": user_data.get("data", {}).get("eveonline", ""),
    "externalId": user_data.get("data", {}).get("externalId", ""),
    "faceIds": user_data.get("data", {}).get("faceIds", None),
    "facebook": user_data.get("data", {}).get("facebook", ""),
    "firstName": user_data.get("data", {}).get("firstName", ""),
    "fitbit": user_data.get("data", {}).get("fitbit", ""),
    "gender": user_data.get("data", {}).get("gender", ""),
    "gitea": user_data.get("data", {}).get("gitea", ""),
    "gitee": user_data.get("data", {}).get("gitee", ""),
    "github": user_data.get("data", {}).get("github", ""),
    "gitlab": user_data.get("data", {}).get("gitlab", ""),
    "google": user_data.get("data", {}).get("google", ""),
    "groups": user_data.get("data", {}).get("groups", []),
    "hash": user_data.get("data", {}).get("hash", ""),
    "heroku": user_data.get("data", {}).get("heroku", ""),
    "homepage": user_data.get("data", {}).get("homepage", ""),
    "id": user_data.get("data", {}).get("id", ""),
    "idCard": user_data.get("data", {}).get("idCard", ""),
    "idCardType": user_data.get("data", {}).get("idCardType", ""),
    "influxcloud": user_data.get("data", {}).get("influxcloud", ""),
    "infoflow": user_data.get("data", {}).get("infoflow", ""),
    "instagram": user_data.get("data", {}).get("instagram", ""),
    "intercom": user_data.get("data", {}).get("intercom", ""),
    "invitation": user_data.get("data", {}).get("invitation", ""),
    "invitationCode": user_data.get("data", {}).get("invitationCode", ""),
    "isAdmin": user_data.get("data", {}).get("isAdmin", False),
    "isDefaultAvatar": user_data.get("data", {}).get("isDefaultAvatar", False),
    "isDeleted": user_data.get("data", {}).get("isDeleted", False),
    "isForbidden": user_data.get("data", {}).get("isForbidden", False),
    "isOnline": user_data.get("data", {}).get("isOnline", False),
    "kakao": user_data.get("data", {}).get("kakao", ""),
    "karma": user_data.get("data", {}).get("karma", 0),
    "language": user_data.get("data", {}).get("language", ""),
    "lark": user_data.get("data", {}).get("lark", ""),
    "lastName": user_data.get("data", {}).get("lastName", ""),
    "lastSigninIp": user_data.get("data", {}).get("lastSigninIp", ""),
    "lastSigninTime": user_data.get("data", {}).get("lastSigninTime", ""),
    "lastSigninWrongTime": user_data.get("data", {}).get("lastSigninWrongTime", ""),
    "lastfm": user_data.get("data", {}).get("lastfm", ""),
    "ldap": user_data.get("data", {}).get("ldap", ""),
    "line": user_data.get("data", {}).get("line", ""),
    "linkedin": user_data.get("data", {}).get("linkedin", ""),
    "location": user_data.get("data", {}).get("location", ""),
    "mailru": user_data.get("data", {}).get("mailru", ""),
    "managedAccounts": user_data.get("data", {}).get("managedAccounts", None),
    "meetup": user_data.get("data", {}).get("meetup", ""),
    "metamask": user_data.get("data", {}).get("metamask", ""),
    "mfaAccounts": user_data.get("data", {}).get("mfaAccounts", None),
    "mfaEmailEnabled": user_data.get("data", {}).get("mfaEmailEnabled", False),
    "mfaPhoneEnabled": user_data.get("data", {}).get("mfaPhoneEnabled", False),
    "microsoftonline": user_data.get("data", {}).get("microsoftonline", ""),
    "multiFactorAuths": user_data.get("data", {}).get("multiFactorAuths", [{"enabled": False, "isPreferred": False, "mfaType": "sms"}]),
    "needUpdatePassword": user_data.get("data", {}).get("needUpdatePassword", False),
    "nextcloud": user_data.get("data", {}).get("nextcloud", ""),
    "okta": user_data.get("data", {}).get("okta", ""),
    "onedrive": user_data.get("data", {}).get("onedrive", ""),
    "oura": user_data.get("data", {}).get("oura", ""),
    "password": "***",  # Placeholder for password
    "passwordSalt": user_data.get("data", {}).get("passwordSalt", ""),
    "passwordType": user_data.get("data", {}).get("passwordType", "plain"),
    "patreon": user_data.get("data", {}).get("patreon", ""),
    "paypal": user_data.get("data", {}).get("paypal", ""),
    "permanentAvatar": user_data.get("data", {}).get("permanentAvatar", ""),
    "permissions": user_data.get("data", {}).get("permissions", []),
    "phone": user_data.get("data", {}).get("phone", ""),
    "phoneVerified": user_data.get("data", {}).get("phoneVerified", False),
    "playstation": user_data.get("data", {}).get("playstation", ""),
    "protonmail": user_data.get("data", {}).get("protonmail", ""),
    "qq": user_data.get("data", {}).get("qq", ""),
    "referredBy": user_data.get("data", {}).get("referredBy", ""),
    "referredByReferralCode": user_data.get("data", {}).get("referredByReferralCode", ""),
    "role": user_data.get("data", {}).get("role", "user"),
    "screenName": user_data.get("data", {}).get("screenName", ""),
    "servicePermissions": user_data.get("data", {}).get("servicePermissions", []),
    "serviceGroups": user_data.get("data", {}).get("serviceGroups", []),
    "shoppingmall": user_data.get("data", {}).get("shoppingmall", ""),
    "signature": user_data.get("data", {}).get("signature", ""),
    "slack": user_data.get("data", {}).get("slack", ""),
    "steam": user_data.get("data", {}).get("steam", ""),
    "subscriptions": user_data.get("data", {}).get("subscriptions", []),
    "tags": user_data.get("data", {}).get("tags", []),
    "telegram": user_data.get("data", {}).get("telegram", ""),
    "tiktok": user_data.get("data", {}).get("tiktok", ""),
    "twitter": user_data.get("data", {}).get("twitter", ""),
    "type": user_data.get("data", {}).get("type", ""),
    "upbit": user_data.get("data", {}).get("upbit", ""),
    "updatedTime": user_data.get("data", {}).get("updatedTime", ""),
    "userAuthInfo": user_data.get("data", {}).get("userAuthInfo", {}),
    "userMeta": user_data.get("data", {}).get("userMeta", {}),
    "userType": user_data.get("data", {}).get("userType", ""),
    "weibo": user_data.get("data", {}).get("weibo", ""),
    "wechat": user_data.get("data", {}).get("wechat", ""),
    "wework": user_data.get("data", {}).get("wework", ""),
    "workplace": user_data.get("data", {}).get("workplace", ""),
    "xiaomi": user_data.get("data", {}).get("xiaomi", ""),
    "yahoo": user_data.get("data", {}).get("yahoo", ""),
    "zotero": user_data.get("data", {}).get("zotero", "")
}


        # Send payload to the /add-user-keys API
        response = requests.post(
            f"{CASDOOR_API_URL}/add-user-keys",
            json=casdoor_payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            params={"id": param_id},
        )

        # Handle the response
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        print (response.json())
        return JSONResponse(content=response.json())

    except requests.exceptions.RequestException as e:
        logging.error(f"Error calling Casdoor API: {e}")
        raise HTTPException(status_code=500, detail="Error communicating with Casdoor API")