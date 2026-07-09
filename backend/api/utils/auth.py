from fastapi import Header, HTTPException
from backend.api.utils.supabase_client import supabase


async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace('Bearer ', '')

    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
