from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["language-tools"])


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_lang: str


@router.get("/translate", response_model=TranslationResponse)
def translate(text: str, target_lang: str):
    return TranslationResponse(
        original_text=text,
        translated_text=f"[translated to {target_lang}]: {text}",
        target_lang=target_lang,
    )
    

class FeedbackResponse(BaseModel):
    original_text: str
    feedback: str


@router.get("/feedback", response_model=FeedbackResponse)
def get_feedback(text: str, target_lang: str):
    return FeedbackResponse(
        original_text=text,
        feedback="This is placeholder feedback on grammar and word choice.",
    )