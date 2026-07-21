from fastapi import Depends, HTTPException
from api.utils.supabase_client import supabase
from api.utils.auth import get_current_user



def create_instructions(target_language=None, current_user = Depends(get_current_user)):
    try:
        user_response = supabase.table('users').select('*').eq('user_id', current_user.id).execute()
    except Exception as e:
        print(f"Error fetching user settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User settings not found")

    user_settings = user_response.data[0]

    try:
        known_words_response = supabase.table('user_words').select('words(word)').eq('user_id', current_user.id).execute()
    except Exception as e:
        print(f"Error fetching known words: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    known_words = [row['words']['word'] for row in known_words_response.data]

    instructions = ""
    
    # Overview
    instructions += (
        f"# Overview\nYou are a language learning conversation partner. "
        f"Your goal is to help the user practice through immersion. "
        f"Stick to words the user already knows and only introduce 1 or 2 new words at a time. "
        f"Carry the conversation by asking questions and bouncing off the user's responses. "
    )
    
    # Rules
    rules = []
    if target_language:
        rules.append(f"Only respond in {target_language}.")
    rules.append("Use known words for approximately 90% of your response.")
    rules.append("Do not explicitly mention language learning. You are a conversation partner, not a teacher.")
    rules.append("Keep your responses under 25 words.")
    instructions += "\n\n# Rules\n" + "\n".join(f"{i + 1}. {rule}" for i, rule in enumerate(rules)) + "\n"
    
    # Known Words
    if known_words:
        word_list = ", ".join(known_words)
        instructions += (
            f"\n\n# Known Words\n{word_list}\n\n"
            f"Use these known words for approximately 90% of your response. You may use "
            f"a small number of new words to help the user learn, but keep the vocabulary "
            f"mostly within what they already know."
        )    

    # Personality Prompt
    if user_settings.get('personality_prompt'):
        instructions += f"\n\n# Personality Prompt\n{user_settings['personality_prompt']}"
    
    # User Name
    name = user_settings.get('name')
    if name:
        instructions += f" \n\n# Name\nCall the user by their name, {name}. You do not have to address them by name in every response, just use it when appropriate."    

    return instructions