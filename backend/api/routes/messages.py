from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from api.utils.auth import get_current_user
from api.utils.supabase_client import supabase
from api.utils.unknown_words import get_unknown_words

router = APIRouter(prefix="/messages", tags=["messages"])


class Messages(BaseModel):
    conversation_id: str
    sender: str
    content: str
    created_at: datetime


@router.post('', status_code=201)
async def post_messages(messages: Messages, current_user = Depends(get_current_user)):
    data = messages.model_dump(exclude_unset=True)
    data['sender'] = current_user.id

    try:
        response = supabase.table('messages').insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data


@router.get('/{conversation_id}')
async def get_messages(conversation_id: str, current_user = Depends(get_current_user)):
    try:
        response = supabase.table('messages').select('*').eq('conversation_id', conversation_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="Messages not found")
    
    try:
        conversation_response = (
            supabase.table("conversations").select("language_id").eq("id", conversation_id).execute()
        )
        
        if not conversation_response.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        language_id = conversation_response.data[0]["language_id"]
        
       
        result = []
        for message in response.data:
            if message["sender"] == "assistant":
                unknown_words = get_unknown_words(language_id, current_user.id, message["content"])
            else:
                unknown_words = []
            result.append({"message": message, "unknown_words": unknown_words})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Failed to load known words: {e}")

    return result
