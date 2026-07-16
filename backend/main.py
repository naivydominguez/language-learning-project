import os
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
    realtime_router
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "*")],
    allow_headers=["*"],
    allow_methods=["*"],
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