from fastapi import Depends, HTTPException
import supabase

from backend.api.utils.auth import get_current_user


def create_instructions(current_user = Depends(get_current_user)):
    try:
        user_response = supabase.table('users').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User settings not found")

    user_settings = user_response.data[0]

    try:
        known_words_response = supabase.table('user_words').select('word').eq('user_id', current_user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    known_words = [row['word'] for row in known_words_response.data]

    instructions = f"# Personality Prompt\n{user_settings.get('personality_prompt') or 'You are a friendly, encouraging language tutor.'}"
    name = user_settings.get('name')
    if name:
        instructions += f" \n\n# Name\nCall the user by their name, {name}."

    if known_words:
        word_list = ", ".join(known_words)
        instructions += (
            f"\n\n# Vocab List\n{word_list}\n\n"
            f"Use these known words for approximately 90% of your response. You may use "
            f"a small number of new words to help the user learn, but keep the vocabulary "
            f"mostly within what they already know."
        )

    return instructions