import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from uuid import UUID
from supabase import create_client, Client
from backend.api.utils.supabase_client import supabase
from backend.api.utils.user_id import get_user_id



router=APIRouter(prefix="/conversations", tags=["conversations"])

class CreateConversationRequest(BaseModel):
    target_lang: str
    name : str | None = None
    
class ConversationResponse(BaseModel):
    id: UUID
    target_lang: str
    created_at: datetime
    
class SendMessageRequest(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    sender: str
    content: str
    created_at: datetime
    
@router.post("/", response_model=ConversationResponse)
def create_conversation(request: CreateConversationRequest, user_id: str = Depends(get_user_id)):
    language_response = supabase.table("languages").select("id").eq("name", request.target_lang).execute()
    if not language_response.data:
        raise HTTPException(status_code=400, detail=f"Unknown language: {request.target_lang}")
    language_id = language_response.data[0]["id"]

    response = supabase.table("conversations").insert({
        "user_id": user_id,
        "language_id": language_id,
    }).execute()

    row = response.data[0]
    return ConversationResponse(
        id=row["id"],
        target_lang=request.target_lang,
        created_at=row["created_at"],
    )

    
@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def send_message(conversation_id: UUID, request: SendMessageRequest, user_id: str = Depends(get_user_id)):
    supabase.table("messages").insert({
        "conversation_id": str(conversation_id),
        "sender": "user",
        "content": request.content,
    }).execute()

    reply_content = " placeholder."

    response = supabase.table("messages").insert({
        "conversation_id": str(conversation_id),
        "sender": "ai",
        "content": reply_content,
    }).execute()

    row = response.data[0]
    return MessageResponse(
        id=row["id"],
        conversation_id=row["conversation_id"],
        sender=row["sender"],
        content=row["content"],
        created_at=row["created_at"],
    )
    

@router.get('/me')
async def get_conversation(current_user = Depends(get_current_user)):
    try:
        response = supabase.table('conversations').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="Conversations not found")

    return response.data


