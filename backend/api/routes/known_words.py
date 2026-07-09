from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.api.utils.supabase_client import supabase
from backend.api.utils.user_id import TEST_USER_ID

router = APIRouter(prefix="/known_words", tags=["known-words"])


class KnownWords(BaseModel):
    word: str
    translation: str
    language: str
    created_at: datetime


@router.post('', status_code=201)
async def post_known_words(knownwords: KnownWords, current_user_id: str = TEST_USER_ID):
    data = knownwords.model_dump(exclude_unset=True)
    data['user_id'] = current_user_id

    try:
        response = supabase.table('known_words').insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data


@router.get('/me')
async def get_words(current_user_id: str = TEST_USER_ID):
    try:
        response = supabase.table('known_words').select('*').eq('user_id', current_user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="Words not found")

    return response.data


@router.delete('/{word_id}', status_code=204)
async def delete_known_word(word_id: str, current_user_id: str = TEST_USER_ID):
    try:
        supabase.table('known_words').delete().eq('id', word_id).eq('user_id', current_user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
