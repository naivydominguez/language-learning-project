import os
from google import genai

GEMINI_MODEL = "gemini-2.5-flash-lite"
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])