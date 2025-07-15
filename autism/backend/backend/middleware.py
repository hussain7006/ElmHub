from fastapi import Depends, HTTPException, status, Request
from utils.token import verify_token

def get_current_user(request: Request):
    # 1. Check cookie
    token = request.cookies.get("access_token")

    # 2. Fallback to Authorization header
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")

    # 3. If no token found
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing in cookie or Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 4. Verify token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload
