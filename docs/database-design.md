# Database Design - Immerbot

The design of our database stores users, conversations, individual messages 
within each conversation and known words from the user

# Relationships:
- One account has many conversations.
- One conversation has many messages.
- One account has many words through bridge.
- One known_word can belong to many accounts through bridge.

# Tables

Accounts:
- id (uuid, primary key, foreign key: auth.users.id)
- username (text, unique)
- first_name (text)
- last_name (text)
- target_lang (text)
- spotify_acc (text)
- jpdb_acc (text)
- anki_acc (text)
- streaks (integer, default 0)
- created_at (timestamp)

conversations:
- id (uuid, primary key)
- user_id (uuid, foreign key -> profiles.id)
- title (text)
- target_lang (text)
- created_at (timestamp)

messages:
- id (uuid, primary key)
- conversation_id (uuid, foreign key: conversations.id)
- sender (text, check: 'user' | 'assistant')
- content (text, not null)
- created_at (timestamp)

known_words:
- id (uuid, primary key)
- user_id (uuid, foreign key: profiles.id)
- word (text, not null)
- translation (text)
- language (text)
- memory_strength (integer, default 0)
- created_at (timestamp)

bridge
- user_id (uuid, foreign key: accounts.id)
- word_id (uuid, foreign key: known_words.id)
- memory_strength (integer, default 0)
- created_at (timestamp)
- primary key: (user_id, word_id)

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


