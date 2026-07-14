from fastapi import APIRouter, HTTPException

<<<<<<< HEAD
from api.utils.supabase_client import supabase
from api.utils.user_id import TEST_USER_ID
=======
from api.utils.auth import get_current_user
from api.utils.supabase_client import supabase
>>>>>>> origin/main

router = APIRouter(prefix="/user_languages", tags=["user-languages"])


@router.get('/me')
async def get_user_languages(current_user_id: str = TEST_USER_ID):
    try:
        response = supabase.table('user_languages').select('*').eq('user_id', current_user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No languages found")

    return response.data
