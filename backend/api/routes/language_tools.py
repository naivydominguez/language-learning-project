import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.utils.gemini_client import client, GEMINI_MODEL
from api.utils.openai_client import client as openai_client
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
        translated_text=result.result,
        target_lang=target_lang,
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

DEMO_CONVERSATION_STARTERS = {
    "english": [
        "Hey! I just watched a really interesting video — have you seen anything good lately?",
        "What are your plans for the weekend? I'm trying to decide what to do.",
        "I've been thinking about trying a new restaurant. Do you like trying new foods?",
        "It's been so busy lately! How do you usually relax after a long day?",
        "I just finished a great book. Do you enjoy reading? What kinds of books do you like?",
        "The weather today is beautiful. Do you prefer sunny days or rainy ones?",
        "I'm thinking about learning a new skill. Is there something you've always wanted to learn?",
        "I saw something funny on the way here today. Do you ever notice interesting things on your commute?",
        "I can't decide what to cook for dinner tonight. Do you enjoy cooking?",
        "A friend just recommended a podcast to me. Do you listen to podcasts? What kind do you like?",
    ],
    "spanish": [
        "¡Hola! Acabo de ver un video muy interesante — ¿has visto algo bueno últimamente?",
        "¿Qué planes tienes para el fin de semana? Estoy tratando de decidir qué hacer.",
        "He estado pensando en probar un restaurante nuevo. ¿Te gusta probar comidas nuevas?",
        "¡Ha habido mucho trabajo últimamente! ¿Cómo te relajas después de un día largo?",
        "Acabo de terminar un libro genial. ¿Te gusta leer? ¿Qué tipo de libros te gustan?",
        "El clima hoy está hermoso. ¿Prefieres los días soleados o los lluviosos?",
        "Estoy pensando en aprender una nueva habilidad. ¿Hay algo que siempre has querido aprender?",
        "Vi algo gracioso de camino aquí hoy. ¿Sueles notar cosas interesantes en tu trayecto?",
        "No puedo decidir qué cocinar para la cena. ¿Te gusta cocinar?",
        "Un amigo me recomendó un podcast. ¿Escuchas podcasts? ¿Qué tipo te gusta?",
    ],
}

@router.get("/conversation-starters", response_model=StarterPromptResponse)
async def get_conversation_starters(target_lang: str, count: int = 10):
    # Hardcode prompts for now
    # prompt = (
    #     f"Generate {count} short, casual conversation-starter opening messages "
    #     f"in {target_lang} for a language-learning chat app. Keep each one "
    #     f"friendly and open-ended."
    # )

    # try:
    #     response = await openai_client.beta.chat.completions.parse(
    #         model=os.environ.get("OPENAI_CHAT_MODEL"),
    #         messages=[{"role": "user", "content": prompt}],
    #         response_format=StarterPromptResult,
    #     )
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Failed to generate conversation starters: {e}")

    # result = response.choices[0].message.parsed
    # return StarterPromptResponse(starters=result.starters)
    starters = DEMO_CONVERSATION_STARTERS.get(target_lang.lower(), DEMO_CONVERSATION_STARTERS["english"])
    return StarterPromptResponse(starters=starters[:count])