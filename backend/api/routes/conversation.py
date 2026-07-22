import os
from urllib import response
import uuid
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime, timezone
from uuid import UUID
from supabase import create_client, Client
from api.utils.openai_client import client
from api.utils.auth import get_current_user
from api.utils.supabase_client import supabase
from api.utils.user_id import get_user_id
from api.utils.instructions import create_instructions
from api.utils.unknown_words import get_unknown_words
from api.utils.token_bias import get_srs_logit_bias

UNKNOWN_WORDS_PERCENTAGE = 10


router = APIRouter(prefix="/conversations", tags=["conversations"])
model = os.environ.get("OPENAI_CHAT_MODEL")


class CreateConversationRequest(BaseModel):
    target_lang: str
    starting_prompt: str | None = None
    name: str | None = None


class ConversationResponse(BaseModel):
    id: UUID
    target_lang: str
    created_at: datetime
    name: str | None
    unknown_words: list[str]


class SendMessageRequest(BaseModel):
    content: str


class VoiceTurnRequest(BaseModel):
    user_transcript: str
    assistant_transcript: str


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    sender: str
    content: str
    created_at: datetime
    unknown_words: list[str]


@router.post("/", response_model=ConversationResponse)
async def create_conversation(
    request: CreateConversationRequest,
    user_id: str = Depends(get_user_id),
):
    try:
        # Get language id
        language_response = (
            supabase.table("languages")
            .select("id")
            .ilike("name", request.target_lang)
            .execute()
        )
        if not language_response.data:
            raise HTTPException(status_code=404, detail="Language not found")
        language_id = language_response.data[0]["id"]

        # Insert new conversation
        conversation_response = (
            supabase.table("conversations")
            .insert(
                {
                    "user_id": user_id,
                    "language_id": language_id,
                    "name": request.name,
                }
            )
            .execute()
        )
        conversation_id = conversation_response.data[0]["id"]
        conversation_created_at = conversation_response.data[0]["created_at"]
        unknown_words = []
        # Insert starter prompt (if applicable). First user message should be sent again by the client in send_message.
        if request.starting_prompt:
            supabase.table("messages").insert(
                {
                    "conversation_id": conversation_id,
                    "sender": "assistant",
                    "content": request.starting_prompt,
                }
            ).execute()
                                        
            unknown_words = get_unknown_words(language_id, user_id, request.starting_prompt)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create conversation: {e}"
        )

    return ConversationResponse(
        id=conversation_id,
        target_lang=request.target_lang,
        created_at=conversation_created_at,
        name=request.name,
        unknown_words=unknown_words,
    )

@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def send_message(
    conversation_id: UUID,
    request: SendMessageRequest,
    user_id: str = Depends(get_user_id),
    current_user = Depends(get_current_user)
):
    # Get conversation's target language
    try:
        conversation_response = (
            supabase.table("conversations").select("language_id").eq("id", str(conversation_id)).execute()
        )
        language_id = conversation_response.data[0]["language_id"]

        language_response = (
            supabase.table("languages").select("name").eq("id", language_id).execute()
        )
        target_language = language_response.data[0]["name"] if language_response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load conversation language: {e}")
    try:
        history_response = (
            supabase.table("messages")
            .select("sender, content")
            .eq("conversation_id", str(conversation_id))
            .order("created_at", desc=False)
            .execute()
        )
        conversation_history = [
            {"role": "assistant" if message["sender"] == "assistant" else "user", "content": message["content"]}
            for message in (history_response.data or [])
        ]
        conversation_history.append({"role": "user", "content": request.content})
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get previous messages from DB: {e}"
        )
    # Get streaming response from OpenAI
    try:
        messages = [
            {"role": "system", "content": create_instructions(target_language, current_user)},
            *conversation_history,
        ]
        # Streams OpenAI responses in the form of `event: event_name\ndata: event_data\n\n` to the client
        async def chat_stream():
            ai_message = ""
            logit_bias = get_srs_logit_bias(user_id, str(language_id), model) if language_id else {}
            streaming_response = await client.chat.completions.create(
                model=model, messages=messages, stream=True, logit_bias=logit_bias
            )

            async for chunk in streaming_response:
                delta = chunk.choices[0].delta.content
                if delta:
                    ai_message += delta
                    yield f"event: delta\ndata: {delta}\n\n"

                if chunk.choices[0].finish_reason is not None:
                    unknown_words = get_unknown_words(language_id, user_id, ai_message)

                    yield f"event: completed\ndata: {json.dumps({'unknown_words': unknown_words})}\n\n"

                    update_db_messages(conversation_id, request, ai_message)

        return StreamingResponse(chat_stream(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get response from OpenAI: {e}"
        )

def update_db_messages(
    conversation_id: UUID,
    request: SendMessageRequest,
    ai_message: str,
):
    try:
        # Insert user message and AI response into the database
        supabase.table("messages").insert(
            [
                {
                    "conversation_id": str(conversation_id),
                    "sender": "user",
                    "content": request.content,
                },
                {
                    "conversation_id": str(conversation_id),
                    "sender": "assistant",
                    "content": ai_message,
                },
            ]
        ).execute()
    except Exception as e:
        print(f"Failed to update messages in DB: {e}")

@router.post("/{conversation_id}/messages/voice", status_code=201)
def save_voice_turn(
    conversation_id: UUID,
    request: VoiceTurnRequest,
    current_user=Depends(get_current_user),
):
    # Realtime API voice sessions are a separate stateful context from the Chat
    # Completions API used for text. These rows carry no special marker - Chat
    # Completions is stateless, so send_message always reconstructs the full
    # conversation history from the DB (including these rows) for the next
    # typed message.
    try:
        response = (
            supabase.table("messages")
            .insert(
                [
                    {
                        "conversation_id": str(conversation_id),
                        "sender": "user",
                        "content": request.user_transcript,
                    },
                    {
                        "conversation_id": str(conversation_id),
                        "sender": "assistant",
                        "content": request.assistant_transcript,
                    },
                ]
            )
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save voice turn: {e}")

    return response.data


@router.get("/me")
async def get_conversation(current_user=Depends(get_current_user)):
    try:
        response = (
            supabase.table("conversations")
            .select("*")
            .eq("user_id", current_user.id)
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return response.data or []

@router.get("/{conversation_id}/language")
async def get_conversation_language(conversation_id: UUID, current_user=Depends(get_current_user)):
    try:
        conversation_response = (
            supabase.table("conversations")
            .select("language_id")
            .eq("id", str(conversation_id))
            .execute()
        )
        if not conversation_response.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        language_id = conversation_response.data[0]["language_id"]

        language_response = (
            supabase.table("languages")
            .select("name")
            .eq("id", language_id)
            .execute()
        )
        if not language_response.data:
            raise HTTPException(status_code=404, detail="Language not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return language_response.data[0]
