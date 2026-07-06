from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from pydantic import BaseModel

load_dotenv()

app = FastAPI()
supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))


class StatsCreate(BaseModel):
    known_words: int
    number_messages: int
    steak: bool


@app.get('/user_languages')
async def get_user_languages():
    response = supabase.table('user_languagges').select('*').execute()
    return response.data

@app.get('/known_words_user_statistics')
async def get_known_words_user_statistics():
    response = supabase.table('temporal_user_statistics').select('known_words').execute()
    return response.data

@app.get('/user_statistics')
async def get_user_statistics():
    response = supabase.table('temporal_user_statistics').select('*').execute()
    return response.data


@app.post('/user_statistics', status_code=201)
async def post_user_statistics(stat: StatsCreate):
    response = supabase.table('temporal_user_statistics').insert(stat.model_dump()).execute()
    return response.data
