from datetime import datetime
from enum import Enum
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from api.utils.auth import get_current_user
from api.utils.supabase_client import supabase
from api.utils.unknown_words import invalidate_known_words_cache

router = APIRouter(prefix="/user_known_words", tags=["user-known-words"])


class UserKnownWords(BaseModel):
    word_id: str
    mastery_level: int
    created_at: None | datetime


class SortBy(str, Enum):
    recent = "recent"
    alphabetical = "alphabetical"
    mastery = "mastery"

class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"

SORT_COLUMN_MAP = {
    SortBy.recent: "created_at",
    SortBy.alphabetical: "word",
    SortBy.mastery: "mastery_level",
}

@router.post('', status_code=201)
async def post_known_words(userknownwords: UserKnownWords, current_user = Depends(get_current_user)):
    data = userknownwords.model_dump(exclude_unset=True)
    data['user_id'] = current_user.id

    try:
        response = supabase.table('user_words').insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    invalidate_known_words_cache(current_user.id)

    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data


@router.get('/me')
async def get_words(
    current_user = Depends(get_current_user),
    sort_by: SortBy = Query(SortBy.recent),
    order: SortOrder = Query(SortOrder.desc),
    search: str = Query(""),
    language: str | None = Query(None),
):
    try:
        query = (
            supabase.table('known_words_view')
            .select('user_id, word_id, created_at, mastery_level, word, language')
            .eq('user_id', current_user.id)
        )

        if language:
            query = query.eq('language', language)

        if search:
            query = query.ilike('word', f'%{search}%')

        column = SORT_COLUMN_MAP[sort_by]
        query = query.order(column, desc=(order == SortOrder.desc))

        response = query.execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return response.data


@router.delete('/{word_id}', status_code=204)
async def delete_known_word(word_id: str, current_user = Depends(get_current_user)):
    try:
        supabase.table('user_words').delete().eq('word_id', word_id).eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    invalidate_known_words_cache(current_user.id)


@router.get('/mastery_level')
async def get_mastery_level(current_user = Depends(get_current_user)):
    try:
        response = supabase.rpc('get_mastery_counts', {'uid': current_user.id}).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return response.data

@router.get('/count')
async def get_word_count(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('user_words').select('word_id', count='exact').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"count": response.count or 0}