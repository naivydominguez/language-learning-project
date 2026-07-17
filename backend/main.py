from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from api.routes import (
    jpdb_router,
    conversations_router,
    language_tools_router,
    users_router,
    user_languages_router,
    user_statistics_router,
    messages_router,
    known_words_router,
    user_known_words_router,
    realtime_router,
    onboarding_data_router
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(jpdb_router)
app.include_router(conversations_router)
app.include_router(language_tools_router)
app.include_router(users_router)
app.include_router(user_languages_router)
app.include_router(user_statistics_router)
app.include_router(messages_router)
app.include_router(known_words_router)
app.include_router(user_known_words_router)
app.include_router(realtime_router)
app.include_router(onboarding_data_router)
