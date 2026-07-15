import os
import uuid
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
from chatbot.generation import generate_response

UNKNOWN_WORDS_PERCENTAGE = 10


router = APIRouter(prefix="/conversations", tags=["conversations"])
model = os.environ.get("OPENAI_CHAT_MODEL")


class CreateConversationRequest(BaseModel):
    target_lang: str
    first_message: str
    starting_prompt: str | None = None
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
async def create_conversation(
    request: CreateConversationRequest,
    user_id: str = Depends(get_user_id),
    current_user=Depends(get_current_user),
):
    if request.starting_prompt:
        input = [
            {"role": "assistant", "content": request.starting_prompt},
            {"role": "user", "content": request.first_message},
        ]
    else:
        input = request.first_message

    # Get streaming response from OpenAI
    try:
        # Streams OpenAI responses in the form of {event: event_name, data: event_data} to the client
        async def chat_stream():
            streaming_response = await client.responses.create(
                model=model,
                instructions=create_instructions(current_user),
                input=input,
                stream=True,
            )

            async for event in streaming_response:
                if event.type == "response.output_text.delta":
                    data = event.delta
                    yield f"event: delta\ndata: {data}\n\n"
                elif event.type == "response.completed":
                    yield "event: completed\ndata: {{}}\n\n"

                    ai_response_id = event.response.id
                    ai_message = event.response.output_text

                    create_db_conversation(user_id, request, ai_message, ai_response_id)
                elif event.type == "response.error":
                    yield f"event: error\ndata: {event.error}\n\n"

        return StreamingResponse(chat_stream(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get response from OpenAI: {e}"
        )


def create_db_conversation(
    user_id: str,
    request: CreateConversationRequest,
    ai_message: str,
    ai_response_id: str,
):
    try:
        # Get language id
        language_response = (
            supabase.table("languages")
            .select("id")
            .eq("name", request.target_lang)
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

        # Insert starter prompt (if applicable), first user message, and 2nd AI message
        if request.starting_prompt:
            supabase.table("messages").insert(
                {
                    "conversation_id": conversation_id,
                    "sender": "ai",
                    "content": request.starting_prompt,
                }
            ).execute()

        supabase.table("messages").insert(
            [
                {
                    "conversation_id": conversation_id,
                    "sender": "user",
                    "content": request.first_message,
                },
                {
                    "openai_response_id": ai_response_id,
                    "conversation_id": conversation_id,
                    "sender": "ai",
                    "content": ai_message,
                },
            ]
        ).execute()

        # Insert the AI's response into the database

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create conversation in DB: {e}"
        )

@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def send_message(
    conversation_id: UUID,
    request: SendMessageRequest,
    user_id: str = Depends(get_user_id),
    current_user = Depends(get_current_user)
):
    input = request.content

    # Get previous message id from DB
    try:
        previous_message_response = (
            supabase.table("messages")
            .select("id")
            .eq("conversation_id", str(conversation_id))
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        previous_message_id = previous_message_response.data[0]["openai_response_id"] if previous_message_response.data else None

        if previous_message_id is None:
            raise HTTPException(status_code=404, detail="Previous message not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get previous message from DB: {e}"
        )

    # Get streaming response from OpenAI
    try:
        # Streams OpenAI responses in the form of {event: event_name, data: event_data} to the client
        async def chat_stream():
            streaming_response = await client.responses.create(
                model=model,
                instructions=create_instructions(current_user),
                input=input,
                stream=True,
                previous_response_id=previous_message_id
            )

            async for event in streaming_response:
                if event.type == "response.output_text.delta":
                    data = event.delta
                    yield f"event: delta\ndata: {data}\n\n"
                elif event.type == "response.completed":
                    yield "event: completed\ndata: {{}}\n\n"

                    ai_response_id = event.response.id
                    ai_message = event.response.output_text

                    update_db_messages(conversation_id, request, ai_message, ai_response_id)
                elif event.type == "response.error":
                    yield f"event: error\ndata: {event.error}\n\n"

        return StreamingResponse(chat_stream(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get response from OpenAI: {e}"
        )

def update_db_messages(
    conversation_id: UUID,
    request: SendMessageRequest,
    ai_message: str,
    ai_response_id: str,
):
    try:
        # Insert user message and AI response into the database
        supabase.table("messages").insert(
            [
                {
                    "conversation_id": conversation_id,
                    "sender": "user",
                    "content": request.content,
                },
                {
                    "openai_response_id": ai_response_id,
                    "conversation_id": conversation_id,
                    "sender": "ai",
                    "content": ai_message,
                },
            ]
        ).execute()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to update messages in DB: {e}"
        )

@router.get("/me")
async def get_conversation(current_user=Depends(get_current_user)):
    try:
        response = (
            supabase.table("conversations")
            .select("*")
            .eq("user_id", current_user.id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not response.data:
        raise HTTPException(status_code=404, detail="Conversations not found")

    return response.data
