import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from uuid import UUID
from supabase import create_client, Client
<<<<<<< HEAD
from api.utils.supabase_client import supabase
from api.utils.user_id import TEST_USER_ID
=======
from api.utils.auth import get_current_user
from api.utils.supabase_client import supabase
from api.utils.user_id import get_user_id
>>>>>>> origin/main
from chatbot.generation import generate_response

UNKNOWN_WORDS_PERCENTAGE = 10


router=APIRouter(prefix="/conversations", tags=["conversations"])

class CreateConversationRequest(BaseModel):
    target_lang: str
    name: str | None = None
    
class ConversationResponse(BaseModel):
    id: UUID
    target_lang: str
    created_at: datetime
    name: str | None
    
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
def create_conversation(request: CreateConversationRequest, starterPrompt: str, user_id: str = TEST_USER_ID):
    language_response = supabase.table("languages").select("id").eq("name", request.target_lang).execute()
    if not language_response.data:
        raise HTTPException(status_code=400, detail=f"Unknown language: {request.target_lang}")
    language_id = language_response.data[0]["id"]

    try:
        response = supabase.table("conversations").insert({
            "user_id": user_id,
            "language_id": language_id,
            "name": request.name,
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create conversation: {e}")

    row = response.data[0]
    conversation_id = row["id"]

    try:
        supabase.table("messages").insert({
            "conversation_id": str(conversation_id),
            "sender": "ai",
            "content": starterPrompt,
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create opening message: {e}")


    return ConversationResponse(
        id=row["id"],
        target_lang=request.target_lang,
        name=row["name"],
        created_at=row["created_at"],
    )

    
@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def send_message(conversation_id: UUID, request: SendMessageRequest, user_id: str = TEST_USER_ID):
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

    known_words = set()
    try:
        known_word_ids_response = supabase.table("user_known_words").select("word_id").eq("user_id", user_id).execute()
        known_word_ids = [word_row["word_id"] for word_row in known_word_ids_response.data]

        if known_word_ids:
            
            known_words_response = (
                supabase.table("words")
                .select("word")
                .eq("language_id", language_id)
                .in_("id", known_word_ids)
                .execute()
            )
            
            known_words = {word_row["word"].lower() for word_row in known_words_response.data}
    except Exception:
        known_words = set()

    try:
        history_response = (
            supabase.table("messages")
            .select("sender, content")
            .eq("conversation_id", str(conversation_id))
            .order("created_at")
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load conversation history: {e}")

    chat_history = [
        {"role": "assistant" if message["sender"] == "ai" else "user", "content": message["content"]}
        for message in history_response.data
    ]
    
    try:
        reply_content = generate_response(chat_history, list(known_words), UNKNOWN_WORDS_PERCENTAGE)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {e}")
    
    try:
        response = supabase.table("messages").insert({
            "conversation_id": str(conversation_id),
            "sender": "ai",
            "content": reply_content,
            }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save ai reply: {e}")
    
    row = response.data[0]
    
    unknown_words = sorted({word for word in reply_content.split() if word.lower() not in known_words})
    
    return MessageResponse(
        id=row["id"],
        conversation_id=row["conversation_id"],
        sender=row["sender"],
        content=row["content"],
        created_at=row["created_at"],
        unknown_words=unknown_words,
    )
    
    

@router.get('/me')
async def get_conversation(current_user_id: str = TEST_USER_ID):
    try:
        response = supabase.table('conversations').select('*').eq('user_id', current_user_id).order('created_at', desc=True).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="Conversations not found")

    return response.data
