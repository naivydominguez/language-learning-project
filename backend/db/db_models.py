import uuid
from typing import Optional
from sqlalchemy import CheckConstraint, DateTime, Mapped, PrimaryKeyConstraint, func, ForeignKey
from sqlalchemy.orm import declarative_base, mapped_column, relationship

Base = declarative_base()

class Language(Base):
    __tablename__ = 'languages'
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=uuid.uuid4)
    name: Mapped[str] 

    words: Mapped[list["Word"]] = relationship("Word", back_populates="language", cascade="all, delete-orphan")
    user_languages: Mapped[list["UserLanguage"]] = relationship("UserLanguage", back_populates="language", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint("streak >= 0", name="check_streak_non_negative")
    )
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=uuid.uuid4)
    native_lang_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('languages.id'))
    username: Mapped[str] = mapped_column(unique=True)
    first_name: Mapped[str]
    last_name: Mapped[str]
    spotify_account: Mapped[Optional[str]]
    streak: Mapped[int] = mapped_column(default=0) # Non negative
    created_at: Mapped[DateTime] = mapped_column(server_default=func.now())

    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    user_known_words: Mapped[list["UserKnownWord"]] = relationship("UserKnownWord", back_populates="user", cascade="all, delete-orphan")
    user_languages: Mapped[list["UserLanguage"]] = relationship("UserLanguage", back_populates="user", cascade="all, delete-orphan")
    native_lang: Mapped[Language] = relationship("Language", foreign_keys=[native_lang_id])

class UserLanguage(Base):
    __tablename__ = 'user_languages'
    __table_args__ = (
        PrimaryKeyConstraint('user_id', 'language_id'),
    )
    
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id'))
    language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('languages.id'))
    
    user: Mapped[User] = relationship("User", back_populates="user_languages")
    language: Mapped[Language] = relationship("Language", back_populates="user_languages")

class Conversation(Base):
    __tablename__ = 'conversations'
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id'))
    language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('languages.id'))
    created_at: Mapped[DateTime] = mapped_column(server_default=func.now())

    user: Mapped[User] = relationship("User", back_populates="conversations")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    language: Mapped[Language] = relationship("Language")

class Message(Base):
    __tablename__ = 'messages'
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('conversations.id'))
    sender: Mapped[str] # 'user' or 'ai'
    content: Mapped[str]
    created_at: Mapped[DateTime] = mapped_column(server_default=func.now())

    conversation: Mapped[Conversation] = relationship("Conversation", back_populates="messages")

class Word(Base):
    __tablename__ = 'known_words'
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=uuid.uuid4)
    language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('languages.id'))
    word: Mapped[str] 

    user_known_words: Mapped[list["UserKnownWord"]] = relationship("UserKnownWord", back_populates="word", cascade="all, delete-orphan")
    language: Mapped[Language] = relationship("Language", back_populates="words")
    
class UserKnownWord(Base):
    __tablename__ = 'user_known_words'
    __table_args__ = (
        PrimaryKeyConstraint('user_id', 'word_id'),
    )
    
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id'))
    word_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('known_words.id'))
    
    user: Mapped[User] = relationship("User", back_populates="user_known_words")
    word: Mapped[Word] = relationship("Word", back_populates="user_known_words")