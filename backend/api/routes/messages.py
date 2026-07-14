from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.utils.supabase_client import supabase
from api.utils.user_id import TEST_USER_ID

router = APIRouter(prefix="/messages", tags=["messages"])


class Messages(BaseModel):
    conversation_id: str
    sender: str
    content: str
    created_at: datetime


@router.post('', status_code=201)
async def post_messages(messages: Messages, current_user_id: str = TEST_USER_ID):
    data = messages.model_dump(exclude_unset=True)
    data['sender'] = current_user_id

    try:
        response = supabase.table('messages').insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data


@router.get('/{conversation_id}')
async def get_messages(conversation_id: str):
    try:
        response = supabase.table('messages').select('*').eq('conversation_id', conversation_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="Messages not found")

    return response.data
