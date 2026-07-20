from api.utils.supabase_client import supabase
from api.utils.lemmatizer import get_unknown_words_by_lemma

def get_unknown_words(language_id:str, user_id:str, message:str) -> list[str]:
    language_response = (
        supabase.table("languages").select("name").eq("id", language_id).execute()
    )
    target_language = language_response.data[0]["name"]
    
    known_words_response = (
        supabase.table("known_words_view")
        .select("word")
        .eq("language", target_language)
        .eq("user_id", user_id)
        .execute()
    )
    
    known_words = {row["word"].lower() for row in known_words_response.data}
    
    return get_unknown_words_by_lemma(message, target_language, known_words)