from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Define allowed origins
allow_origins = [
    "http://22.0.0.117:3000",  # Add your frontend URL here
]

# Detailed CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  # Set specific allowed origins
    allow_credentials=True,  # Allow cookies to be sent with requests
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow specific methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Allow all headers to be exposed
    max_age=3600,
)

class TokenRequest(BaseModel):
    code: str

@app.options("/api/token")
async def token_options():
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "http://22.0.0.117:3000",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.post("/api/token")
async def exchange_token(request: Request, token_request: TokenRequest):
    # Log incoming request details
    logger.info(f"Received request from origin: {request.headers.get('origin')}")
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Request body: {token_request}")
    print(token_request.code)

    try:
        token_url = "https://authtest.cialabs.org/login/oauth/access_token"
        token_request_data = {
            "client_id": "931cbff5298aef218fd0",
            "client_secret": "31f07306354c22c3a4782e1e5057e0545e54abc8",
            "code": token_request.code,
            "redirect_uri": "http://22.0.0.117:3000/callback",
            "grant_type": "authorization_code",
        }
        print(token_request_data)

        logger.info(f"Sending request to Casdoor with data: {token_request_data}")

        async with httpx.AsyncClient() as client:
            response = await client.post(
                token_url,
                data=token_request_data,
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            )
            
            # Log response details
            logger.info(f"Casdoor response status: {response.status_code}")
            logger.info(f"Casdoor response headers: {dict(response.headers)}")
            logger.info(f"Casdoor response body: {response.text}")

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to exchange token: {response.text}"
                )
            
            return JSONResponse(
                content=response.json(),
                headers={
                    "Access-Control-Allow-Origin": "http://22.0.0.117:3000",
                    "Access-Control-Allow-Credentials": "true",
                }
            )

    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}




# from fastapi import FastAPI, HTTPException, Request
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import httpx
# import logging
# # import cookies

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI()

# # Define allowed origins
# allow_origins = [
#     "http://22.0.0.117:3000",  # Add your frontend URL here
# ]

# # Detailed CORS configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allow_origins,  # Set specific allowed origins
#     allow_credentials=True,  # Allow cookies to be sent with requests
#     allow_methods=["GET", "POST", "OPTIONS"],  # Allow specific methods
#     allow_headers=["*"],  # Allow all headers
#     expose_headers=["*"],  # Allow all headers to be exposed
#     max_age=3600,
# )

# class TokenRequest(BaseModel):
#     code: str

# @app.post("/api/token")
# async def exchange_token(request: Request, token_request: TokenRequest):
#     # Log incoming request details
#     logger.info(f"Received request from origin: {request.headers.get('origin')}")
#     logger.info(f"Request headers: {dict(request.headers)}")
#     logger.info(f"Request body: {token_request}")

#     try:
#         # Casdoor OAuth URL
#         token_url = "https://authtest.cialabs.org/login/oauth/access_token"
        
#         # Prepare token request data
#         token_request_data = {
#             "client_id": "931cbff5298aef218fd0",
#             "client_secret": "31f07306354c22c3a4782e1e5057e0545e54abc8",
#             "code": token_request.code,
#             "redirect_uri": "http://22.0.0.117:3000/callback",
#             "grant_type": "authorization_code",
#         }

#         logger.info(f"Sending request to Casdoor with data: {token_request_data}")

#         async with httpx.AsyncClient() as client:
#             # Send the request to Casdoor to exchange the code for a token
#             response = await client.post(
#                 token_url,
#                 data=token_request_data,
#                 headers={
#                     "Content-Type": "application/x-www-form-urlencoded",
#                     "Accept": "application/json"
#                 }
#             )

#             # Log response details
#             logger.info(f"Casdoor response status: {response.status_code}")
#             logger.info(f"Casdoor response body: {response.text}")

#             if response.status_code != 200:
#                 raise HTTPException(
#                     status_code=response.status_code,
#                     detail=f"Failed to exchange token: {response.text}"
#                 )

#             # Retrieve access token from the response
#             response_data = response.json()
#             access_token = response_data.get("access_token")

#             if not access_token:
#                 raise HTTPException(
#                     status_code=400,
#                     detail="No access token received"
#                 )

#             # Store access token in a cookie (expires in 7 days)
#             response = JSONResponse(
#                 content={"message": "Token successfully received and stored in cookie."},
#                 headers={
#                     "Access-Control-Allow-Origin": "http://22.0.0.117:3000",
#                     "Access-Control-Allow-Credentials": "true",
#                 }
#             )
#             response.set_cookie(
#                 key="access_token",
#                 value=access_token,
#                 max_age=3600 * 24 * 7,  # 7 days expiration
#                 httponly=True,  # Ensure the cookie is not accessible by JavaScript
#                 secure=True,  # Only send over HTTPS
#                 same_site="Lax"
#             )

#             return response

#     except HTTPException as he:
#         logger.error(f"HTTP Exception: {str(he)}")
#         raise he
#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         raise HTTPException(
#             status_code=500,
#             detail=str(e)
#         )
