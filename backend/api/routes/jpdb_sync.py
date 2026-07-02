import os

import requests
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from backend.api.utils.user_id import get_user_id
from backend.db.db_models import User, UserKnownWord, Word
from backend.db.session import get_db_session

router = APIRouter(prefix="/jpdb", tags=["jpdb"])
JPDB_URL = os.environ.get("JPDB_URL")


class RegisterKeyPost(BaseModel):
    api_key: str


# Adds the user's API key to the associated user in the DB.
# This also automatically syncs the user's JPDB data to the DB.
@router.post("/register-key")
def register_key(
    request: RegisterKeyPost,
    user_id: str = Depends(get_user_id),
    db: Session = Depends(get_db_session),
):
    key = request.api_key
    # Syncing the user with their API key.
    user = db.get(User, user_id)
    user.jpdb_api_key = key
    db.commit()

    # Syncing the user's known words from JPDB.
    sync_jpdb_words(user, db)
    return {"message": "Key registered."}


@router.put("/sync")
def sync_jpdb(
    user_id: str = Depends(get_user_id), db: Session = Depends(get_db_session)
):
    user = db.get(User, user_id)
    sync_jpdb_words(user, db)
    return {"message": "JPDB sync complete."}


def sync_jpdb_words(user: User, db: Session):
    key = user.jpdb_api_key

    # Step 1: Query the JPDB API to see the user's known words

    # Get a list of all the user's decks
    result = requests.post(
        f"{JPDB_URL}/list-user-decks",
        headers={"Authorization": f"Bearer {key}"},
        json={"fields": ["id"]},
    ).json()
    if result.get("error_message") is not None:
        raise Exception(f"JPDB API error: {result.get('message')}")

    deck_ids = [deck_info[0] for deck_info in result.get('decks')]

    # Get a list of word ids from all the decks and compile them into a single list
    cards = []
    for deck_id in deck_ids:
        result = requests.post(
            f"{JPDB_URL}/deck/list-vocabulary",
            headers={"Authorization": f"Bearer {key}"},
            json={"id": deck_id}
        ).json()

        if result.get("error_message") is not None:
            raise Exception(f"JPDB API error: {result.get('error_message')}")
        
        cards.extend(result.get("vocabulary", []))

    # Translate them into a list of actual words with one last lookup
    result = requests.post(
        f"{JPDB_URL}/lookup-vocabulary",
        headers={"Authorization": f"Bearer {key}"},
        json={"list": cards, "fields": ["spelling", "card_level"]}
    ).json()
    if result.get("error_message") is not None:
        raise Exception(f"JPDB API error: {result.get('error_message')}")
    
    known_words = result.get("vocabulary_info")

    # Step 2: Update the DB based on the result

    JAPANESE_LANGUAGE_ID = "f3e1c5d0-8b2a-4c6e-9f1b-2d3e4f5a6b7c"
    # TODO: Replace with actual Japanese language ID from the DB
    # NOTE: This is a hardcoded value, but it will never change and it also saves DB queries

    # Record new words that don't exist in the Words table yet
    insert_statement = insert(Word).values(
        [{"language_id": JAPANESE_LANGUAGE_ID, "word": word} for word in known_words]
    )
    insert_statement = insert_statement.on_conflict_do_nothing(
        index_elements=["language_id", "word"]
    )
    db.execute(insert_statement)

    # Update bridge table based on new word ids
    word_ids = (
        db.execute(
            select(Word.id).where(
                Word.word.in_(known_words),
                Word.language_id == JAPANESE_LANGUAGE_ID,
            )
        )
        .scalars()
        .all()
    )

    insert_statement = insert(UserKnownWord).values(
        [{"user_id": user.id, "word_id": word_id} for word_id in word_ids]
    )
    insert_statement = insert_statement.on_conflict_do_nothing(
        index_elements=["user_id", "word_id"]
    )
    db.execute(insert_statement)

    db.commit()
