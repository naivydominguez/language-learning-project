from api.utils.supabase_client import supabase
from api.utils.lemmatizer import get_unknown_words_by_lemma

_known_words_cache: dict[tuple[str, str], set[str]] = {}


def invalidate_known_words_cache(user_id: str) -> None:
    for cache_slot in matching_cache_slots(user_id):
        del _known_words_cache[cache_slot]


def matching_cache_slots(user_id: str) -> list[tuple[str, str]]:
    return [slot for slot in _known_words_cache if slot[0] == user_id]


def get_unknown_words(language_id: str, user_id: str, message: str) -> list[str]:
    target_language = get_language_name(language_id)
    known_words = get_known_words(user_id, target_language)
    return get_unknown_words_by_lemma(message, target_language, known_words, user_id=user_id)


def get_language_name(language_id: str) -> str:
    response = supabase.table("languages").select("name").eq("id", language_id).execute()
    return response.data[0]["name"]


def get_known_words(user_id: str, target_language: str) -> set[str]:
    cache_slot = (user_id, target_language)
    known_words = _known_words_cache.get(cache_slot)
    if known_words is None:
        known_words = fetch_known_words(user_id, target_language)
        _known_words_cache[cache_slot] = known_words
    return known_words


def fetch_known_words(user_id: str, target_language: str) -> set[str]:
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
    return known_words