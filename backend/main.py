from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from typing import Optional

load_dotenv()

app = FastAPI()
supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))


class StatsCreate(BaseModel):
    user_id: str
    known_words: int
    number_messages: int
    steak: bool

class Settings(BaseModel):
    user_id: str
    target_languages: Optional[str] = None
    native_language: Optional[str] = None
    name: Optional[str] = None
    study_time_goal: Optional[str] = None
    personality_prompt: Optional[str] = None


@app.get('/user_languages/{user_id}')
async def get_user_languages(user_id: str):
    response = supabase.table('user_languages').select('*').eq('user_id', user_id).execute()
    return response.data

@app.get('/known_words_user_statistics/{user_id}')
async def get_known_words_user_statistics(user_id: str):
    response = supabase.table('temporal_user_statistics').select('known_words').eq('user_id', user_id).execute()
    return response.data

@app.get('/user_statistics/{user_id}')
async def get_user_statistics(user_id: str):
    response = supabase.table('temporal_user_statistics').select('*').eq('user_id', user_id).execute()
    return response.data


@app.post('/user_statistics', status_code=201)
async def post_user_statistics(stat: StatsCreate):
    response = supabase.table('temporal_user_statistics').insert(stat.model_dump()).execute()
    return response.data


@app.patch('/users/{user_id}')
async def update_user_settings(user_id: str, settings: Settings):
    updates = settings.model_dump(exclude_unset=True)
    response = supabase.table('users').update(updates).eq('user_id', user_id).execute()
    return response.data

@app.get('/users/{user_id}')
async def get_user_id(user_id: str):
    response = supabase.table('users').select('*').eq('user_id', user_id).execute()
    return response.data

@app.post('/users', status_code=201)
async def post_settings(settings: Settings):
    response = supabase.table('users').insert(settings.model_dump(exclude_unset=True)).execute()
    return response.data