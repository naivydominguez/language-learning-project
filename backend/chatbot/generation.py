import pandas as pd
import numpy as np
from sympy import pprint
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, LogitsProcessor, pipeline 

MODEL_NAME = "HuggingFaceTB/SmolLM2-360M-Instruct"
KNOWN_WORDS_BIAS = 3

if torch.cuda.is_available():
    device = "cuda"
elif torch.backends.mps.is_available():
    device = "mps"
else:
    device = "cpu"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, device_map="auto")

# We define the mask here. We discourage unknown words but don't ban them 
# so users with few known words can still get a response. During some steps of 
# generation we invert the mask to encourage unknown words to be used.
class LogitsMask(LogitsProcessor):
    def __init__(self, known_token_ids, unknown_words_percentage):
        self.known_token_ids = set(known_token_ids)
        self.unknown_words_percentage = unknown_words_percentage

    def __call__(self, input_ids, scores):
        # return scores
        # Encouraging/discouraging a word based on chance
        use_unknown_word = np.random.rand() * 100 < self.unknown_words_percentage
        bias = -KNOWN_WORDS_BIAS if use_unknown_word else KNOWN_WORDS_BIAS

        for token_id in self.known_token_ids:
            scores[:, token_id] += bias

        return scores

# chat: A dict containing the chat history.
# known_words: An array of the user's known words.
# unknown_words_percentage: A number from 1-100 to adjust (roughly) how much unknown words will be used in the response.
def generate_response(chat, known_words, unknown_words_percentage):
    known_token_ids = [tokenizer.eos_token_id, tokenizer.pad_token_id]
    for word in known_words:
        # We need to consider word variants because they count as different tokens
        bare_word = word.strip()
        variants = [bare_word, f" {bare_word}", f"{bare_word} "]
        for variant in variants:
            known_token_ids.extend(tokenizer.encode(variant, add_special_tokens=False))
    
    logits_mask = LogitsMask(known_token_ids, unknown_words_percentage)

    chat_history = tokenizer.apply_chat_template(chat, return_tensors="pt").to(device)
    outputs = model.generate(**chat_history, logits_processor=[logits_mask], do_sample=True, max_new_tokens=1000, 
                             eos_token_id=tokenizer.eos_token_id, pad_token_id=tokenizer.pad_token_id)

    history_length = chat_history["input_ids"].shape[1]
    new_tokens = outputs[0][history_length:]
    new_message = tokenizer.decode(new_tokens, skip_special_tokens=True)

    # Remove the "assistant" marker for the model
    if new_message.startswith("assistant"):
        new_message = new_message[len("assistant"):].strip()
       
    return new_message 