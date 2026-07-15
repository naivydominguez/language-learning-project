from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from api.utils.supabase_client import supabase

bearer_scheme = HTTPBearer()

def get_user_id(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    user_data = supabase.auth.get_user(token)
    user = user_data.user

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user.id