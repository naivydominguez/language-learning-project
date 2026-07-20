import spacy

MODEL_MAP = {
    "english": "en_core_web_sm",
    "spanish": "es_core_news_sm",
    "french": "fr_core_news_sm",
    "german": "de_core_news_sm",
    "italian": "it_core_news_sm",
    "portuguese": "pt_core_news_sm",
    # add the rest later, jsut these for now
}

_nlp_cache = {}
def get_nlp(language:str):
    if language not in _nlp_cache:
        _nlp_cache[language] = spacy.load(MODEL_MAP[language])
    return _nlp_cache[language]

def get_unknown_words_by_lemma(text: str, language: str, known_words: set[str]) -> list[str]:
    nlp = get_nlp(language)
    doc = nlp(text)

    unknown_words = []
    for token in doc:
        if token.is_punct or token.is_space:
            continue
        lemma = token.lemma_.lower()
        if lemma not in known_words:
            unknown_words.append(token.text)

    return unknown_words