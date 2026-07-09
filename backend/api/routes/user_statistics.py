from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.api.utils.auth import get_current_user
from backend.api.utils.supabase_client import supabase

router = APIRouter(tags=["user-statistics"])


class StatsCreate(BaseModel):
    known_words: int
    number_messages: int
    steak: bool


@router.get('/known_words_user_statistics/me')
async def get_known_words_user_statistics(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('temporal_user_statistics').select('known_words').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No statistics found")

    return response.data


@router.get('/user_statistics/me')
async def get_user_statistics(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('temporal_user_statistics').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No statistics found")

    return response.data


@router.post('/user_statistics', status_code=201)
async def post_user_statistics(stat: StatsCreate, current_user = Depends(get_current_user)):
    data = stat.model_dump()
    data['user_id'] = current_user.id

    try:
        response = supabase.table('temporal_user_statistics').insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data
