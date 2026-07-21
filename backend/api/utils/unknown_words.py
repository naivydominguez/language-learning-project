from api.utils.supabase_client import supabase
from api.utils.lemmatizer import get_unknown_words_by_lemma


def get_known_words_for_user(language_id: str, user_id: str) -> tuple[str, set[str]]:
    language_response = (
        supabase.table("languages").select("name").eq("id", language_id).execute()
    )
    target_language = language_response.data[0]["name"]

    known_words = set()
    page_size = 1000
    start = 0
    while True:
        response = (
            supabase.table("known_words_view")
            .select("word")
            .eq("language", target_language)
            .eq("user_id", user_id)
            .range(start, start + page_size - 1)
            .execute()
        )
        known_words.update(row["word"].lower() for row in response.data)
        if len(response.data) < page_size:
            break
        start += page_size

    return target_language, known_words



def get_unknown_words(language_id:str, user_id:str, message:str) -> list[str]:
    target_language, known_words = get_known_words_for_user(language_id, user_id)
    return get_unknown_words_by_lemma(message, target_language, known_words)
    # language_response = (
    #     supabase.table("languages").select("name").eq("id", language_id).execute()
    # )
    # target_language = language_response.data[0]["name"]
    
    # # known_words_response = (
    # #     supabase.table("known_words_view")
    # #     .select("word")
    # #     .eq("language", target_language)
    # #     .eq("user_id", user_id)
    # #     .execute()
    # # )
    # # known_words = {row["word"].lower() for row in known_words_response.data}
    # known_words = set()
    # page_size = 1000
    # start = 0
    # while True:
    #     response = (
    #         supabase.table("known_words_view")
    #         .select("word")
    #         .eq("language", target_language)
    #         .eq("user_id", user_id)
    #         .range(start, start + page_size - 1)
    #         .execute()
    #     )
    #     known_words.update(row["word"].lower() for row in response.data)
    #     if len(response.data) < page_size:
    #         break
    #     start += page_size
    
    # return get_unknown_words_by_lemma(message, target_language, known_words)