from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from apis.auth import router as auth_router
from apis.specialist import router as specialist_router
from apis.parent import router as parent_router
from apis.child import router as child_router

from utils.token import verify_token, extract_token
from middleware import get_current_user
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001", "http://141.148.187.5:8001"],  # Allow all origins
    allow_credentials=True,  # Allow cookies and headers (e.g., Authorization)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
app.include_router(auth_router)
app.include_router(specialist_router)
app.include_router(parent_router)
app.include_router(child_router)



@app.middleware("http")
async def verify_jwt_middleware(request: Request, call_next):
    public_paths = ["/auth/login", "/auth/signup", "/ws/signaling", "/ws/stream"]
    if request.method == "OPTIONS":
        return await call_next(request)
    if any(request.url.path.startswith(p) for p in public_paths):
        return await call_next(request)

    token = extract_token(request)
    payload = verify_token(token)
    if not payload:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid or expired token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await call_next(request)


@app.get("/protected")
def protected_route(user=Depends(get_current_user)):
    return {"message": "You are authenticated", "user": user}

@app.get("/env-check")
def check_environment():
    """Check if environment variables are loaded correctly"""
    return {
        "openai_api_key_loaded": bool(os.getenv("OPENAI_API_KEY")),
        "autism_ai_server_loaded": bool(os.getenv("AUTISM_AI_SERVER")),
        "autism_ai_server_url": os.getenv("AUTISM_AI_SERVER", "Not set")
    }

