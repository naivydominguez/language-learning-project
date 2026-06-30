# Product Requirements Document (PRD)

# Immerbot

## Overview

Immerbot is a language learning chatbot built around research on language immersion and comprehensible input. Rather than relying on structured lessons or repetitive exercises, Immerbot enables users to acquire a language naturally through conversations tailored to their current vocabulary knowledge. By continuously adapting its language output, the chatbot provides an endless source of engaging, personalized immersion.

---

## Problem

The vast majority of language learners study inefficiently. Many rely on applications like Duolingo or traditional classroom instruction, which often emphasize explicit learning over meaningful exposure to the language. As a result, learners spend significant time studying without developing real-world fluency.

A smaller group of learners adopts immersion-based methods, which have been shown to be highly effective. However, immersion presents its own challenges. Finding content that matches a learner's current level of comprehension is difficult, and the amount of suitable content is limited. Content that is too difficult leads to frustration, while content that is too easy provides little opportunity for growth.

---

## Solution

Immerbot provides an AI-powered conversation partner capable of generating unlimited personalized content.

The application maintains a model of each user's known vocabulary and adjusts every response to remain within the learner's zone of comprehensible input while gradually introducing new words. This creates an effectively infinite source of personalized immersion that continuously evolves alongside the learner's progress.

Instead of searching for appropriately leveled content, learners simply engage in conversations that naturally become more advanced as their vocabulary expands.

---

## Target Users

### Beachhead Market

Language learners who already believe in immersion-based learning and actively consume native content.

### Broader Market

Language learners who currently rely on traditional study methods, such as language learning apps, flashcards, or classroom instruction, and are looking for a more engaging and effective way to build fluency.

---

## Features

### Adaptive AI Conversations

* Chat naturally with an AI in the target language.
* Create multiple conversation threads.
* Resume previous conversations at any time.
* Conversations become progressively more advanced as the learner improves.
* Highlight any word or phrase to see its translation.

### Writing Feedback

* Get feedback on grammar mistakes.
* Get suggestions on word choice to sound more like a native speaker.

### Personalized Comprehensible Input

* Maintain a database of known vocabulary for each user.
* Tailor chatbot responses using the learner's vocabulary knowledge.
* Introduce new vocabulary gradually to maximize comprehension and acquisition.

### Flashcard Integration

Import known vocabulary from popular spaced repetition platforms, including:

* JPDB
* Anki
* Quizlet

This allows existing learners to begin using Immerbot without rebuilding their vocabulary database.

### Proactive Conversations

Rather than waiting for users to initiate every interaction, Immerbot occasionally starts new conversations on its own, sending notifications that simulate a friend reaching out first. This encourages consistent immersion and makes conversations feel more natural.

### Social Media Integrations

Users can connect platforms such as YouTube to personalize conversations around creators and content they already enjoy.

For example, when a subscribed creator uploads a new video, Immerbot can initiate a conversation discussing the topic, encouraging users to engage with current interests in their target language.

### Learning Analytics

Provide insights into learning progress, including:

* Vocabulary growth over time
* Total words learned and memory strength of known words
* Conversation activity

### Daily Streaks

Track daily immersion habits by awarding a streak whenever a user spends a configurable minimum amount of time chatting each day.

---

## User Flow

### First-Time Experience

1. User signs up.
2. Complete onboarding explaining the immersion methodology.
3. Configure target language, goals, notification preferences, and integrations.
4. Import known vocabulary (optional).
5. Begin first conversation.

### Ongoing Learning Loop

1. User starts or resumes a conversation.
2. Chat with Immerbot.
3. Encounter and acquire new vocabulary.
4. Newly acquired words are added to the user's vocabulary profile.
5. Future conversations adapt to reflect the learner's expanding vocabulary.
6. Immerbot periodically initiates new conversations through notifications, encouraging continued immersion.

