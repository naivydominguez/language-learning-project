from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from backend.api.routes import router as jpdb_routes
app = FastAPI()
app.include_router(jpdb_routes.router)