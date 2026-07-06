import uuid
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timezone
from uuid import UUID


router=APIRouter(prefix="/conversations", tags=["conversations"])

class CreateConversationRequest(BaseModel):
    target_lang: str
    title: str | None = None
    
class ConversationResponse(BaseModel):
    id: UUID
    target_lang: str
    title: str | None
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
def create_conversation(request: CreateConversationRequest):
    return ConversationResponse(
        id=uuid.uuid4(),
        target_lang=request.target_lang,
        title=request.title,
        created_at=datetime.now(timezone.utc),
    )
    
@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def send_message(conversation_id: UUID, request: SendMessageRequest):
    return MessageResponse(
        id=uuid.uuid4(),
        conversation_id=conversation_id,
        sender="ai",
        content="This is a placeholder response.",
        created_at=datetime.now(timezone.utc),
    )
    