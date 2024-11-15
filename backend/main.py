# from fastapi import FastAPI, HTTPException
# from fastapi.responses import JSONResponse
# import httpx
# from fastapi.middleware.cors import CORSMiddleware
# import logging
# from fastapi import Request
# import requests

# app = FastAPI()
# logger = logging.getLogger(__name__)

# # Configure logging to show more details
# logging.basicConfig(level=logging.INFO)

# # Allow CORS for your frontend origin
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://22.0.0.117:3000"],  # Frontend domain
#     allow_credentials=True,  # Allow cookies
#     allow_methods=["*"],  # Allow all HTTP methods
#     allow_headers=["*"],  # Allow all headers
# )

# @app.post("/api/token")
# async def exchange_token(request: Request):
#     try:
#         # Extract the 'code' from the request body
#         body = await request.json()
#         token_request_code = body.get('code')
#         print("here",token_request_code)

#         if not token_request_code:
#             raise HTTPException(status_code=400, detail="Authorization code not provided")

#         # Casdoor token exchange URL
#         token_url = "https://authtest.cialabs.org/api/login/oauth/access_token"

#         # Prepare query parameters for the request
#         params = {
#             "grant_type": "authorization_code",
#             "client_id": "931cbff5298aef218fd0",
#             "client_secret": "31f07306354c22c3a4782e1e5057e0545e54abc8",
#             "code": token_request_code,
#             "redirect_uri": "http://22.0.0.117:3000/callback"
#         }

#         logging.info(f"Sending request to Casdoor with params: {params}")

#         # Send the request to Casdoor for token exchange
#         token_response = requests.post(token_url, data=params)
        
#         # Check the response from Casdoor
#         logging.info(f"Received response from Casdoor: Status {token_response.status_code}")
#         logging.info(f"Response content: {token_response.text}")

#         # If the request was unsuccessful, return an error response
#         if token_response.status_code != 200:
#             error_data = token_response.json()
#             logging.error(f"Error response from Casdoor: {error_data}")
#             return JSONResponse(
#                 status_code=400,
#                 content={
#                     "error": error_data.get("error", "Unknown error"),
#                     "error_description": error_data.get("error_description", "No description available")
#                 }
#             )
        
#         # Parse the JSON response from Casdoor to get the access token
#         token_data = token_response.json()
#         access_token = token_data.get('access_token')

#         # If no access token is returned, raise an error
#         if not access_token:
#             logging.error("No access token received from Casdoor")
#             raise HTTPException(status_code=400, detail="No access token received")
        

#         # Return the token as a response (optional)
#         return JSONResponse(content={"access_token": access_token})

#     except Exception as e:
#         # Catch any unexpected errors
#         logging.error(f"Unexpected error: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")








from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import requests
from fastapi.middleware.cors import CORSMiddleware
import logging
from pydantic import BaseModel

app = FastAPI()
logger = logging.getLogger(__name__)

# Configure logging to show more details
logging.basicConfig(level=logging.INFO)

# Allow CORS for your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://22.0.0.117:3000"],  # Frontend domain
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Casdoor Configuration
CASDOOR_API_URL = "https://authtest.cialabs.org/api"
CLIENT_ID = "931cbff5298aef218fd0"
CLIENT_SECRET = "31f07306354c22c3a4782e1e5057e0545e54abc8"
REDIRECT_URI = "http://22.0.0.117:3000/callback"

# Token storage (temporary; ideally, use a secure method for token storage)
access_token = None


@app.post("/api/token")
async def exchange_token(request: Request):
    global access_token  # Use global to store the token

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

        # Check the response from Casdoor
        logging.info(f"Received response from Casdoor: Status {token_response.status_code}")
        logging.info(f"Response content: {token_response.text}")

        # If the request was unsuccessful, return an error response
        if token_response.status_code != 200:
            error_data = token_response.json()
            logging.error(f"Error response from Casdoor: {error_data}")
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


# New Endpoint: Fetch User Details
@app.get("/api/user-details")
async def get_user_details(user_id: str ):
    global access_token  # Use the stored token
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is not available. Please authenticate first.")

    try:
        response = requests.get(
            f"{CASDOOR_API_URL}/get-user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            params={"owner": user_id, "name": user_id},  # Pass the user_id as both owner and name
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())

        return JSONResponse(content=response.json())

    except Exception as e:
        logging.error(f"Error fetching user details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch user details.")


# Data model for the Generate Keys request payload
class GenerateKeysPayload(BaseModel):
    owner: str
    name: str


@app.post("/generate-keys")
async def generate_keys(user_data: dict):
    global access_token  # Use the stored token
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is not available. Please authenticate first.")

    try:
        # Prepare the payload based on user_data
        casdoor_payload = {
            "owner": user_data.get("owner", ""),
            "name": user_data.get("name", ""),
            "createdTime": user_data.get("createdTime", ""),
            "accessKey": user_data.get("accessKey", ""),
            "accessSecret": user_data.get("accessSecret", ""),
            "accessToken": user_data.get("accessToken", ""),
            "address": user_data.get("address", []),
            "adfs": user_data.get("adfs", ""),
            "affiliation": user_data.get("affiliation", ""),
            "alipay": user_data.get("alipay", ""),
            "amazon": user_data.get("amazon", ""),
            "apple": user_data.get("apple", ""),
            "auth0": user_data.get("auth0", ""),
            "avatar": user_data.get("avatar", ""),
            "avatarType": user_data.get("avatarType", ""),
            "azuread": user_data.get("azuread", ""),
            "azureadb2c": user_data.get("azureadb2c", ""),
            "baidu": user_data.get("baidu", ""),
            "balance": user_data.get("balance", 0),
            "battlenet": user_data.get("battlenet", ""),
            "bilibili": user_data.get("bilibili", ""),
            "bio": user_data.get("bio", ""),
            "birthday": user_data.get("birthday", ""),
            "bitbucket": user_data.get("bitbucket", ""),
            "box": user_data.get("box", ""),
            "casdoor": user_data.get("casdoor", ""),
            "cloudfoundry": user_data.get("cloudfoundry", ""),
            "countryCode": user_data.get("countryCode", "US"),
            "createdIp": user_data.get("createdIp", ""),
            "currency": user_data.get("currency", ""),
            "custom": user_data.get("custom", ""),
            "dailymotion": user_data.get("dailymotion", ""),
            "deezer": user_data.get("deezer", ""),
            "deletedTime": user_data.get("deletedTime", ""),
            "digitalocean": user_data.get("digitalocean", ""),
            "dingtalk": user_data.get("dingtalk", ""),
            "discord": user_data.get("discord", ""),
            "displayName": user_data.get("displayName", ""),
            "douyin": user_data.get("douyin", ""),
            "dropbox": user_data.get("dropbox", ""),
            "education": user_data.get("education", ""),
            "email": user_data.get("email", ""),
            "emailVerified": user_data.get("emailVerified", False),
            "eveonline": user_data.get("eveonline", ""),
            "externalId": user_data.get("externalId", ""),
            "faceIds": user_data.get("faceIds", None),
            "facebook": user_data.get("facebook", ""),
            "firstName": user_data.get("firstName", ""),
            "fitbit": user_data.get("fitbit", ""),
            "gender": user_data.get("gender", ""),
            "gitea": user_data.get("gitea", ""),
            "gitee": user_data.get("gitee", ""),
            "github": user_data.get("github", ""),
            "gitlab": user_data.get("gitlab", ""),
            "google": user_data.get("google", ""),
            "groups": user_data.get("groups", []),
            "hash": user_data.get("hash", ""),
            "heroku": user_data.get("heroku", ""),
            "homepage": user_data.get("homepage", ""),
            "id": user_data.get("id", ""),
            "idCard": user_data.get("idCard", ""),
            "idCardType": user_data.get("idCardType", ""),
            "influxcloud": user_data.get("influxcloud", ""),
            "infoflow": user_data.get("infoflow", ""),
            "instagram": user_data.get("instagram", ""),
            "intercom": user_data.get("intercom", ""),
            "invitation": user_data.get("invitation", ""),
            "invitationCode": user_data.get("invitationCode", ""),
            "isAdmin": user_data.get("isAdmin", False),
            "isDefaultAvatar": user_data.get("isDefaultAvatar", False),
            "isDeleted": user_data.get("isDeleted", False),
            "isForbidden": user_data.get("isForbidden", False),
            "isOnline": user_data.get("isOnline", False),
            "kakao": user_data.get("kakao", ""),
            "karma": user_data.get("karma", 0),
            "language": user_data.get("language", ""),
            "lark": user_data.get("lark", ""),
            "lastName": user_data.get("lastName", ""),
            "lastSigninIp": user_data.get("lastSigninIp", ""),
            "lastSigninTime": user_data.get("lastSigninTime", ""),
            "lastSigninWrongTime": user_data.get("lastSigninWrongTime", ""),
            "lastfm": user_data.get("lastfm", ""),
            "ldap": user_data.get("ldap", ""),
            "line": user_data.get("line", ""),
            "linkedin": user_data.get("linkedin", ""),
            "location": user_data.get("location", ""),
            "mailru": user_data.get("mailru", ""),
            "managedAccounts": user_data.get("managedAccounts", None),
            "meetup": user_data.get("meetup", ""),
            "metamask": user_data.get("metamask", ""),
            "mfaAccounts": user_data.get("mfaAccounts", None),
            "mfaEmailEnabled": user_data.get("mfaEmailEnabled", False),
            "mfaPhoneEnabled": user_data.get("mfaPhoneEnabled", False),
            "microsoftonline": user_data.get("microsoftonline", ""),
            "multiFactorAuths": user_data.get("multiFactorAuths", [{"enabled": False, "isPreferred": False, "mfaType": "sms"}]),
            "needUpdatePassword": user_data.get("needUpdatePassword", False),
            "nextcloud": user_data.get("nextcloud", ""),
            "okta": user_data.get("okta", ""),
            "onedrive": user_data.get("onedrive", ""),
            "oura": user_data.get("oura", ""),
            "password": "***",  # Placeholder for password
            "passwordSalt": user_data.get("passwordSalt", ""),
            "passwordType": user_data.get("passwordType", "plain"),
            "patreon": user_data.get("patreon", ""),
            "paypal": user_data.get("paypal", ""),
            "permanentAvatar": user_data.get("permanentAvatar", ""),
            "permissions": user_data.get("permissions", []),
            "phone": user_data.get("phone", ""),
            "preHash": user_data.get("preHash", ""),
            "preferredMfaType": user_data.get("preferredMfaType", ""),
            "properties": user_data.get("properties", {}),
            "ranking": user_data.get("ranking", 5),
            "region": user_data.get("region", ""),
            "roles": user_data.get("roles", []),
            "salesforce": user_data.get("salesforce", ""),
            "score": user_data.get("score", 2000),
            "slack": user_data.get("slack", ""),
            "soundcloud": user_data.get("soundcloud", ""),
            "spotify": user_data.get("spotify", ""),
            "steam": user_data.get("steam", ""),
            "stripe": user_data.get("stripe", ""),
            "tag": user_data.get("tag", "staff"),
            "tiktok": user_data.get("tiktok", ""),
            "type": user_data.get("type", "normal-user"),
            "web3onboard": user_data.get("web3onboard", ""),
            "weibo": user_data.get("weibo", ""),
            "zoom": user_data.get("zoom", ""),
            "updatedTime": user_data.get("updatedTime", ""),
        }

        # Send the payload to Casdoor API
        response = requests.post(
            f"{CASDOOR_API_URL}/add-user-keys",
            json=casdoor_payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())

        return JSONResponse(content=response.json())

    except Exception as e:
        logging.error(f"Error generating keys: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate keys")
