To test locally:

1. Package installation (commands start from root dir)
```
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

cd frontend
pnpm i
```

`npm i` also works as an alternative to `pnpm i`. 

2. Environment setup
   
Create backend/.env from backend/.env.template: 
- Populate the supabase env variables (DATABASE_URL, SUPABASE_URL, SUPABASE_KEY).
- Get a GEMINI_API_KEY from Google AI Studio.

Create frontend/.env:
- Set EXPO_PUBLIC_BACKEND_URL=http://localhost:8000

3. Running the app

Open two terminals and run the commands (commands start from root dir):
```
# Terminal 1
source venv/bin/activate
uvicorn backend.main:app --reload
```

```
# Terminal 2
cd frontend
pnpm expo start
```
`npm expo start` also works as an alternative to `pnpm expo start`.
