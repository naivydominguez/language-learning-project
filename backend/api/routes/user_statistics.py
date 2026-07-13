from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.api.utils.auth import get_current_user
from backend.api.utils.supabase_client import supabase
from datetime import date
router = APIRouter(tags=["user-statistics"])


class StatsCreate(BaseModel):
    known_words: int
    number_messages: int
    steak: bool

class StreakCreate(BaseModel):
    time_logged: int


@router.get('/known_words_user_statistics/me')
async def get_known_words_user_statistics(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('temporal_user_statistics').select('words').eq('user_id', current_user.id).execute()
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

@router.post('/streak', status_code=201)
async def post_streak(time: StreakCreate, current_user = Depends(get_current_user)):
    today = date.today().isoformat()

    try:
        existing = (
            supabase.table('temporal_user_statistics')
            .select('id, time_logged')
            .eq('user_id', current_user.id)
            .eq('date', today)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if existing.data:
        current_total = existing.data[0]['time_logged']
        row_id = existing.data[0]['id']

        try:
            response = (
                supabase.table('temporal_user_statistics')
                .update({'time_logged': current_total + time.time_logged})
                .eq('id', row_id)
                .execute()
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    else:
        try:
            response = (
                supabase.table('temporal_user_statistics')
                .insert({
                    'user_id': current_user.id,
                    'date': today,
                    'time_logged': time.time_logged,
                })
                .execute()
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to log time")

    return response.data