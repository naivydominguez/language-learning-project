from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from api.utils.auth import get_current_user
from api.utils.supabase_client import supabase

router = APIRouter(prefix="/user_languages", tags=["user-languages"])


class SetUserLanguageRequest(BaseModel):
    language: str


@router.get('/me', response_model=list[str])
async def get_user_languages(current_user = Depends(get_current_user)):
    try:
        response = (
            supabase.table('user_languages')
            .select('*')
            .eq('user_id', current_user.id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    language_ids = [row['language_id'] for row in response.data]

    try:
        languages_response = (
            supabase.table('languages')
            .select('name')
            .in_('id', language_ids)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return [row['name'] for row in languages_response.data]


@router.post('/me', status_code=201)
async def set_user_language(request: SetUserLanguageRequest, current_user = Depends(get_current_user)):
    try:
        language_response = (
            supabase.table('languages')
            .select('id')
            .eq('name', request.language)
            .execute()
        )
        if not language_response.data:
            raise HTTPException(status_code=404, detail="Language not found")
        language_id = language_response.data[0]['id']

        # user_languages is a many-to-many join table, but the picker UI only ever
        # has one "current" language - replace any existing selection rather than
        # accumulating rows.
        supabase.table('user_languages').upsert({
            'user_id': current_user.id,
            'language_id': language_id,
        }, on_conflict="user_id,language_id").execute()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"language": request.language}


@router.delete('/me')
async def remove_user_language(request : SetUserLanguageRequest ,current_user = Depends(get_current_user)):

    try:
        language_response = (
            supabase.table('languages')
            .select('id')
            .eq('name', request.language)
            .execute()
            )
        if not language_response.data:
            raise HTTPException(status_code=404, detail="Language not found")
        language_id= language_response.data[0]['id']
        
        (
            supabase.table('user_languages')
            .delete()
            .eq('user_id', current_user.id)
            .eq('language_id', language_id)
            .execute()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))