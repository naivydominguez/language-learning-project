from fastapi import APIRouter
from pydantic import BaseModel
from api.utils.gemini_client import client, GEMINI_MODEL


router = APIRouter(tags=["language-tools"])


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_lang: str


@router.get("/translate", response_model=TranslationResponse)
def translate(text: str, target_lang: str):
    prompt = f"Translate the following text to {target_lang}. Respond with only the translation, no extra commentary.\n\nText: {text}"
    response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)

    return TranslationResponse(
        original_text=text,
        translated_text=response.text.strip(),
        target_lang=target_lang,
    )
    

class FeedbackResponse(BaseModel):
    original_text: str
    feedback: str


@router.get("/feedback", response_model=FeedbackResponse)
def get_feedback(text: str, target_lang: str):
    prompt = (
        f"You are a friendly, encouraging language tutor. The following text was "
        f"written by a student learning {target_lang}. Point out any grammar "
        f"mistakes or word choice issues, and briefly explain why, in a "
        f"supportive tone.\n\nText: {text}"
    )
    response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)

    return FeedbackResponse(
        original_text=text,
        feedback=response.text.strip(),
    )