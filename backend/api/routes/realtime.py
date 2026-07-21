import os

import httpx
from fastapi import APIRouter, Depends, HTTPException

from api.utils.auth import get_current_user
from api.utils.instructions import create_instructions

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
DEFAULT_REALTIME_MODEL = "gpt-realtime-2.1-mini"

router = APIRouter(tags=["realtime"])


@router.post('/realtime/client_secret')
async def create_realtime_client_secret(current_user = Depends(get_current_user)):
    session_config = {
        "type": "realtime",
        "model": os.environ.get("OPENAI_REALTIME_MODEL") or DEFAULT_REALTIME_MODEL,
        "instructions": create_instructions(current_user=current_user),
        "reasoning": {"effort": "minimal"},
        "audio": {
            "input": {
                "transcription": {"model": "whisper-1"},
            },
            "output": {
                "voice": "marin",
            }
        },
        "output_modalities": ["audio"]
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