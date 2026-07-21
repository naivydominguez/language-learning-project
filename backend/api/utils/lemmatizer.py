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

# split the pagination into seperate function
def get_known_lemmas(known_words: set[str], language: str) -> set[str]:
    if language not in MODEL_MAP:
        return {word.lower() for word in known_words}

    nlp = get_nlp(language)
    known_lemmas = set()
    for word in known_words:
        known_lemmas.add(word.lower())
        for token in nlp(word):
            known_lemmas.add(token.lemma_.lower())
    return known_lemmas


def get_unknown_words_from_lemmas(text: str, language: str, known_lemmas: set[str]) -> list[str]:
    if language not in MODEL_MAP:
        return [
            word for word in text.split()
            if word.strip(string.punctuation).lower() not in known_lemmas
        ]

    nlp = get_nlp(language)
    doc = nlp(text)

    unknown_words = []
    for token in doc:
        if token.is_punct or token.is_space:
            continue
        if token.lemma_.lower() not in known_lemmas:
            unknown_words.append(token.text)

    return unknown_words


def get_unknown_words_by_lemma(text: str, language: str, known_words: set[str]) -> list[str]:
    known_lemmas = get_known_lemmas(known_words, language)
    return get_unknown_words_from_lemmas(text, language, known_lemmas)

    
    # if language not in MODEL_MAP:
    #     return [
    #         word for word in text.split()
    #         if word.strip(string.punctuation).lower() not in known_words
    #     ]

    # nlp = get_nlp(language)

    # known_lemmas = set()
    # for word in known_words:
    #     known_lemmas.add(word.lower())
    #     for token in nlp(word):
    #         known_lemmas.add(token.lemma_.lower())

    # doc = nlp(text)

    # unknown_words = []
    # for token in doc:
    #     if token.is_punct or token.is_space:
    #         continue
    #     if token.lemma_.lower() not in known_lemmas:
    #         unknown_words.append(token.text)

    # return unknown_words