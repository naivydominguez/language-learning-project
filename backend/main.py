from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from backend.api.routes import jpdb_router, conversations_router, language_tools_router

app = FastAPI()
app.include_router(jpdb_router)
app.include_router(conversations_router)
app.include_router(language_tools_router)