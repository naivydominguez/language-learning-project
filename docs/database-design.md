# Database Design - Immerbot

The design of our database stores users, conversations, individual messages 
within each conversation and known words from the user

# Relationships

- One profile → many conversations
- One conversation → many messages
- One profile → many known_words

# Tables

profiles:
- id 
- username
- first_name
- last_name
- target_lang
- created_at

conversations:
- id
- user_id 
- title
- target_lang
- created_at

messages:
- id
- conversation_id 
- sender (user | ai)
- content
- created_at

known_words:
- id
- user_id 
- word
- translation
- language
- created_at

# Design Decisions

We designed four core tables to support out language-learning chatbot 
system.

- Profiles are separated from authentication to allow flexible user data 
storage.
- Conversations group messages into distinct chat sessions, enabling contextual 
memory for the chatbot.
- Messages are stored individually to support chat history, pagination, and AI 
response tracking.
- Known_words tracks vocabulary learned by each user, allowing the system to
 gradually introduce new vocabulary based on user familiarity.

This structure supports future features such as progress tracking, spaced 
repetition learning, and personalized difficulty adjustment.


