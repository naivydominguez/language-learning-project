from fastapi import APIRouter, Depends, HTTPException

from backend.api.utils.auth import get_current_user
from backend.api.utils.supabase_client import supabase

router = APIRouter(prefix="/user_languages", tags=["user-languages"])


@router.get('/me')
async def get_user_languages(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('user_languages').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No languages found")

    return response.data
