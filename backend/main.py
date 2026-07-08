from fastapi import FastAPI, Depends, Header, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from supabase import create_client, Client

from backend.api.routes import jpdb_router, conversations_router, language_tools_router

app = FastAPI()
app.include_router(jpdb_router)
app.include_router(conversations_router)
app.include_router(language_tools_router)

supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))


class StatsCreate(BaseModel):
    known_words: int
    number_messages: int
    steak: bool


class Settings(BaseModel):
    target_languages: Optional[str] = None
    native_language: Optional[str] = None
    name: Optional[str] = None
    study_time_goal: Optional[str] = None
    personality_prompt: Optional[str] = None


async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace('Bearer ', '')

    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@app.get('/user_languages/me')
async def get_user_languages(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('user_languages').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No languages found")

    return response.data


@app.get('/known_words_user_statistics/me')
async def get_known_words_user_statistics(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('temporal_user_statistics').select('known_words').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No statistics found")

    return response.data


@app.get('/user_statistics/me')
async def get_user_statistics(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('temporal_user_statistics').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="No statistics found")

    return response.data


@app.post('/user_statistics', status_code=201)
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


@app.patch('/users/me')
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


@app.get('/users/me')
async def get_user(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('users').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return response.data


@app.post('/users', status_code=201)
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


