from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import httpx
from fastapi.middleware.cors import CORSMiddleware
import logging
from fastapi import Request
import requests

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

@app.post("/api/token")
async def exchange_token(request: Request):
    try:
        # Extract the 'code' from the request body
        body = await request.json()
        token_request_code = body.get('code')
        print("here",token_request_code)

        if not token_request_code:
            raise HTTPException(status_code=400, detail="Authorization code not provided")

        # Casdoor token exchange URL
        token_url = "https://authtest.cialabs.org/api/login/oauth/access_token"

        # Prepare query parameters for the request
        params = {
            "grant_type": "authorization_code",
            "client_id": "931cbff5298aef218fd0",
            "client_secret": "31f07306354c22c3a4782e1e5057e0545e54abc8",
            "code": token_request_code,
            "redirect_uri": "http://22.0.0.117:3000/callback"
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
                    "error_description": error_data.get("error_description", "No description available")
                }
            )
        
        # Parse the JSON response from Casdoor to get the access token
        token_data = token_response.json()
        access_token = token_data.get('access_token')

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
