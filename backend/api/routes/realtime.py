import os

import httpx
from fastapi import APIRouter, Depends, HTTPException

from backend.api.utils.auth import get_current_user
from backend.api.utils.supabase_client import supabase

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

router = APIRouter(tags=["realtime"])


@router.post('/realtime/client_secret')
async def create_realtime_client_secret(current_user = Depends(get_current_user)):
    try:
        user_response = supabase.table('users').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User settings not found")

    user_settings = user_response.data[0]

    try:
        known_words_response = supabase.table('user_words').select('word').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    known_words = [row['word'] for row in known_words_response.data]

    instructions = user_settings.get('personality_prompt') or "You are a language tutor."

    name = user_settings.get('name')
    if name:
        instructions += f" Call the user by their name, {name}."

    if known_words:
        word_list = ", ".join(known_words)
        instructions += (
            f" The user currently knows these words: {word_list}. "
            f"Use these known words for approximately 90% of your response. You may use "
            f"a small number of new words to help the user learn, but keep the vocabulary "
            f"mostly within what they already know."
        )

    session_config = {
        "type": "realtime",
        "model": "gpt-realtime-2.1-mini",
        "instructions": instructions,
        "reasoning": {"effort": "minimal"},
    }

    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(
                "https://api.openai.com/v1/realtime/client_secrets",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "expires_after": {"anchor": "created_at", "seconds": 600},
                    "session": session_config,
                },
            )
        response.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return response.json()