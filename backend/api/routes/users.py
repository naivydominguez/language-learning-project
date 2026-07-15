from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from api.utils.auth import get_current_user
from api.utils.supabase_client import supabase

router = APIRouter(prefix="/users", tags=["users"])


class Settings(BaseModel):
    target_languages: Optional[str] = None
    native_language: Optional[str] = None
    name: Optional[str] = None
    study_time_goal: Optional[str] = None
    personality_prompt: Optional[str] = None


@router.patch('/me')
async def update_user_settings(settings: Settings, current_user = Depends(get_current_user)):
    updates = settings.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        response = supabase.table('users').update(updates).eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return response.data


@router.get('/me')
async def get_user(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('users').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return response.data


@router.post('', status_code=201)
async def post_settings(settings: Settings, current_user = Depends(get_current_user)):
    data = settings.model_dump(exclude_unset=True)
    data['user_id'] = current_user.id

    try:
        response = supabase.table('users').insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data
