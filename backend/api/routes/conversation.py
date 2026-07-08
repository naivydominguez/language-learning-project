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
    title: str | None = None
    
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
    unknown_words: list[str]
    
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
    conversation_response = supabase.table("conversations").select("language_id").eq("id", str(conversation_id)).execute()
    if not conversation_response.data:
        raise HTTPException(status_code=404, detail="Conversation not found")
    language_id = conversation_response.data[0]["language_id"]

    try:
        supabase.table("messages").insert({
            "conversation_id": str(conversation_id),
            "sender": "user",
            "content": request.content,
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save message: {e}")

    reply_content = "This is a placeholder response."

    try:
        response = supabase.table("messages").insert({
            "conversation_id": str(conversation_id),
            "sender": "ai",
            "content": reply_content,
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save ai reply: {e}")

    row = response.data[0]

    unknown_words = []
    try:
        known_word_ids_response = supabase.table("user_known_words").select("word_id").eq("user_id", user_id).execute()
        known_word_ids = [w["word_id"] for w in known_word_ids_response.data]

        known_words = set()
        if known_word_ids:
            known_words_response = supabase.table("known_words").select("word").eq("language_id", language_id).in_("id", known_word_ids).execute()
            known_words = {w["word"].lower() for w in known_words_response.data}

        unknown_words = sorted({word for word in reply_content.split() if word.lower() not in known_words})
    except Exception:
        unknown_words = []

    return MessageResponse(
        id=row["id"],
        conversation_id=row["conversation_id"],
        sender=row["sender"],
        content=row["content"],
        created_at=row["created_at"],
        unknown_words=unknown_words,
    )
    