from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.utils.supabase_client import supabase
from api.utils.user_id import TEST_USER_ID

router = APIRouter(tags=["user-statistics"])


class StatsCreate(BaseModel):
    known_words: int
    number_messages: int
    steak: bool


@router.get('/known_words_user_statistics/me')
async def get_known_words_user_statistics(current_user_id: str = TEST_USER_ID):
    try:
        response = supabase.table('temporal_user_statistics').select('known_words').eq('user_id', current_user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No statistics found")

    return response.data


@router.get('/user_statistics/me')
async def get_user_statistics(current_user_id: str = TEST_USER_ID):
    try:
        response = supabase.table('temporal_user_statistics').select('*').eq('user_id', current_user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No statistics found")

    return response.data


@router.post('/user_statistics', status_code=201)
async def post_user_statistics(stat: StatsCreate, current_user_id: str = TEST_USER_ID):
    data = stat.model_dump()
    data['user_id'] = current_user_id

    try:
        response = supabase.table('temporal_user_statistics').insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data
