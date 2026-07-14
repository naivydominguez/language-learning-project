from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from api.utils.supabase_client import supabase
<<<<<<< HEAD

# Testing-branch only: static user id used in place of real auth (see
# backend/api/routes/*.py). Do not merge into main.
TEST_USER_ID = "11111111-1111-1111-1111-111111111111"
=======
>>>>>>> origin/main

bearer_scheme = HTTPBearer()

def get_user_id(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    user_data = supabase.auth.get_user(token)
    user = user_data.user

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user.id