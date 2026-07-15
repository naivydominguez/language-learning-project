from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.utils.gemini_client import client, GEMINI_MODEL
from google.genai import types


router = APIRouter(tags=["language-tools"])

class TranslationResult(BaseModel):
    result:str


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_lang: str


@router.get("/translate", response_model=TranslationResponse)
def translate(text: str, target_lang: str):
    prompt = f"Translate the following text to {target_lang}. Respond with only the translation, no extra commentary.\n\nText: {text}"
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TranslationResult,
            ),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to translate text: {e}")

    result = TranslationResult.model_validate_json(response.text)

    return TranslationResponse(
        original_text=text,
        result=result.result,
    )


class FeedbackResult(BaseModel):
    result: str

class FeedbackResponse(BaseModel):
    original_text: str
    result: str


@router.get("/feedback", response_model=FeedbackResponse)
def get_feedback(text: str, target_lang: str):
    prompt = (
        f"You are a friendly, encouraging language tutor. The following text was "
        f"written by a student learning {target_lang}. Point out any grammar "
        f"mistakes or word choice issues, and briefly explain why, in a "
        f"supportive tone.\n\nText: {text}"
    )
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=FeedbackResult,
            ),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate feedback: {e}")

    result = FeedbackResult.model_validate_json(response.text)

    return FeedbackResponse(
        original_text=text,
        result=result.result,
    )

class StarterPromptResult(BaseModel):
    starters: list[str]
    
class StarterPromptResponse(BaseModel):
    starters: list[str]
    
@router.get("/conversation-starters", response_model=StarterPromptResponse)
def get_conversation_starters(target_lang:str, count: int = 10):
    prompt = (
        f"Generate {count} short, casual conversation-starter opening messages "
        f"in {target_lang} for a language-learning chat app. Keep each one "
        f"friendly and open-ended."
    )
    
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents = prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=StarterPromptResult,
            ),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate conversation starters: {e}")
    
    result = StarterPromptResult.model_validate_json(response.text)
    return StarterPromptResponse(starters=result.starters)