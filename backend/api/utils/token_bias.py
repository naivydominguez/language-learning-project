import tiktoken

from api.utils.srs import get_words_due_for_review

MAX_LOGIT_BIAS_ENTRIES = 1024  

def build_positive_logit_bias(words: list[str], model: str, bias: int = 4) -> dict[str, int]:
    if bias <= 0:
        raise ValueError("bias must be strictly positive")
    if bias > 100:
        raise ValueError("bias must be within OpenAI's documented range of -100 to 100")

    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("o200k_base")

    token_ids: dict[int, None] = {}
    for word in words:
        if len(token_ids) >= MAX_LOGIT_BIAS_ENTRIES:
            break
        bare_tokens = encoding.encode(word)
        space_prefixed_tokens = encoding.encode(" " + word)
        for tokens in (bare_tokens, space_prefixed_tokens):
            if not tokens:
                continue
            first_token_id = tokens[0]

            if encoding.decode([first_token_id]).strip() == "":
                continue
            if first_token_id in token_ids:
                continue
            if len(token_ids) >= MAX_LOGIT_BIAS_ENTRIES:
                break
            token_ids[first_token_id] = None

    return {str(token_id): bias for token_id in token_ids}


def get_srs_logit_bias(
    user_id: str,
    language_id: str,
    model: str,
    bias: int = 4,
) -> dict[str, int]:
    words_due_for_review = get_words_due_for_review(user_id, language_id)

    if not words_due_for_review:
        return {}

    return build_positive_logit_bias(words_due_for_review, model, bias)
