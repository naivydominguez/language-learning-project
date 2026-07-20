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

_nlp_cache = {}
def get_nlp(language:str):
    if language not in _nlp_cache:
        _nlp_cache[language] = spacy.load(MODEL_MAP[language])
    return _nlp_cache[language]

def get_unknown_words_by_lemma(text: str, language: str, known_words: set[str]) -> list[str]:
    if language not in MODEL_MAP:
        return [
            word for word in text.split()
            if word.strip(string.punctuation).lower() not in known_words
        ]
    
    nlp = get_nlp(language)
    
    known_lemmas = {token.lemma_.lower() for word in known_words for token in nlp(word)}
    
    doc = nlp(text)

    unknown_words = []
    for token in doc:
        if token.is_punct or token.is_space:
            continue
        if token.lemma_.lower() not in known_lemmas:
            unknown_words.append(token.text)

    return unknown_words