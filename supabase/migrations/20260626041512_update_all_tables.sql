alter table public.profiles
rename to accounts;

alter table public.accounts
add column if not exists spotify_acc text,
add column if not exists jpdb_acc text,
add column if not exists anki_acc text,
add column if not exists streaks integer default 0;

alter table public.known_words
add column if not exists memory_strength integer default 0;

create table if not exists public.user_words (
    user_id uuid references public.accounts(id) on delete cascade,
    word_id uuid references public.known_words(id) on delete cascade,
    memory_strength integer default 0,

    primary key (user_id, word_id)
    
);
