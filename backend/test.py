from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import logging

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

# Pydantic model for request validation
class TokenRequest(BaseModel):
    code: str

@app.post("/api/token")
async def exchange_token(token_request: TokenRequest):  # Use Pydantic model for automatic validation
    try:
        logger.info(f"Received authorization code: {token_request.code}")

        token_url = "https://authtest.cialabs.org/login/oauth/access_token"
        token_request_data = {
            "client_id": "931cbff5298aef218fd0",
            "client_secret": "31f07306354c22c3a4782e1e5057e0545e54abc8",
            "code": token_request.code,
            "redirect_uri": "http://22.0.0.117:3000/callback",
            "grant_type": "authorization_code",
        }

        logger.info("Sending request to Casdoor...")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                token_url,
                data=token_request_data,
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            )
            
            logger.info(f"Casdoor response status: {response.status_code}")
            logger.info(f"Casdoor response headers: {response.headers}")
            
            # Log response body safely
            try:
                response_body = response.json()
                logger.info(f"Casdoor response body: {response_body}")
            except ValueError:
                logger.error(f"Non-JSON response from Casdoor: {response.text}")
                response_body = {"text": response.text}

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to exchange token: {response.text}"
                )

            return JSONResponse(
                content=response_body,
                headers={
                    "Access-Control-Allow-Origin": "http://22.0.0.117:3000",
                    "Access-Control-Allow-Credentials": "true",
                }
            )

    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=422, detail=str(ve))
    
    except httpx.RequestError as re:
        logger.error(f"Request error: {str(re)}")
        raise HTTPException(status_code=503, detail="Service temporarily unavailable")
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

# Optional: Add a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}    

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

# Allow CORS for your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://22.0.0.117:3000"],  # Frontend domain
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers (Content-Type, Authorization, etc.)
)

class TokenRequest(BaseModel):
    code: str

@app.post("/api/token")
async def exchange_token(request: Request):
    try:
        # Attempt to parse the request body to ensure JSON format
        print("here1")
        token_request = await request.json()  # This reads the request body as JSON
        print("here12")
        logger.info(f"Received JSON body: {token_request}")
        print("here3")
        
        # Check if 'code' is present in the JSON payload
        if 'code' not in token_request:
            raise HTTPException(status_code=400, detail="Authorization code not provided")
        print("here4")
        
        code = token_request['code']
        logger.info(f"Authorization code received: {code}")
        print("here5")

        token_url = "https://authtest.cialabs.org/login/oauth/access_token"
        token_request_data = {
            "client_id": "931cbff5298aef218fd0",
            "client_secret": "31f07306354c22c3a4782e1e5057e0545e54abc8",
            "code": code,
            "redirect_uri": "http://22.0.0.117:3000/callback",
            "grant_type": "authorization_code",
        }

        print("here6")
        
        # Send the request to Casdoor to exchange the code for an access token
        async with httpx.AsyncClient() as client:
            response = await client.post(
                token_url,
                data=token_request_data,
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            )
            print("here7")
            # Log response from Casdoor
            logger.info(f"Casdoor response status: {response.status_code}")
            logger.info(f"Casdoor response body: {response.text}")

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to exchange token: {response.text}"
                )
            
            print("here8")
            print("response at last ", response)
            # Return the access token in the response
            return JSONResponse(
                content= response.json(),
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true",
                }
            )
        
        print("here9")

    except ValueError as ve:
        # Handles JSON decode error
        logger.error("Failed to parse JSON body: Expecting JSON format")
        raise HTTPException(status_code=400, detail="Invalid JSON format in request body")
    
    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he)}")
        raise he
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected server error: {str(e)}"
        )
