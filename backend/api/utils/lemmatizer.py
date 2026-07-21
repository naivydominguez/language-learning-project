import spacy
import string

MODEL_MAP = {
    "english": "en_core_web_sm",
    "spanish": "es_core_news_sm",
    "french": "fr_core_news_sm",
    "german": "de_core_news_sm",
    "italian": "it_core_news_sm",
    "portuguese": "pt_core_news_sm",
    "dutch": "nl_core_news_sm",
    "greek": "el_core_news_sm",
    "japanese": "ja_core_news_sm",
    "korean": "ko_core_news_sm",
    "chinese (simplified)": "zh_core_web_sm",
    "russian": "ru_core_news_sm",
}

_nlp_cache: dict[str, "spacy.language.Language"] = {}

def get_nlp(language: str):
    if language not in _nlp_cache:
        _nlp_cache[language] = spacy.load(MODEL_MAP[language], exclude=["parser", "ner"])
    return _nlp_cache[language]


_known_lemmas_cache: dict[tuple[str, str], tuple[frozenset, set[str]]] = {}


def get_unknown_words_by_lemma(
    text: str, language: str, known_words: set[str], user_id: str | None = None
) -> list[str]:
    if language not in MODEL_MAP:
        unknown_words = []
        for word in text.split():
            bare_word = word.strip(string.punctuation).lower()
            if bare_word not in known_words:
                unknown_words.append(word)
        return unknown_words

    nlp = get_nlp(language)

    known_words_snapshot = frozenset(known_words)
    cache_slot = (user_id, language) if user_id is not None else None
    cached_entry = _known_lemmas_cache.get(cache_slot) if cache_slot is not None else None

    if cached_entry is not None and cached_entry[0] == known_words_snapshot:
        known_lemmas = cached_entry[1]
    else:
        known_lemmas = set()
        for word in known_words:
            known_lemmas.add(word.lower())
        for doc in nlp.pipe(known_words, batch_size=256):
            for token in doc:
                known_lemmas.add(token.lemma_.lower())

        if cache_slot is not None:
            _known_lemmas_cache[cache_slot] = (known_words_snapshot, known_lemmas)

    doc = nlp(text)
    unknown_words = []
    for token in doc:
        if token.is_punct or token.is_space:
            continue
        if token.lemma_.lower() not in known_lemmas:
            unknown_words.append(token.text)

    return unknown_words