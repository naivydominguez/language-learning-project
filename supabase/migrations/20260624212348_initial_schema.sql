create table public.accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  first_name text,
  last_name text,
  target_lang text,

  spotify_acc text,
  jpdb_acc text,
  anki_acc text,

  streaks integer default 0,

  created_at timestamp default now()

);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.accounts(id) on delete cascade,
  title text,
  target_lang text,
  created_at timestamp default now()
);


create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender text check (sender in ('user', 'ai')),
  content text not null,
  created_at timestamp default now()
);


create table public.known_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.accounts(id) on delete cascade,
  word text not null,
  translation text,
  language text,

  memory_strength integer default 0,

  created_at timestamp default now()
);

create table public.bridge (
    user_id uuid references public.accounts(id) on delete cascade,
    word_id uuid references public.known_words(id) on delete cascade,
    memory_strength integer default 0,

    primary key (user_id, word_id)
);
