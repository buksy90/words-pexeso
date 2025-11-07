# Pexeso - Memory Card Game

A Nuxt 3 application with TypeScript and Vuetify built for creating a Pexeso (Memory) card game.

The game aims at helping children learn read first characters and join them in single words.

## Roadmap
1. Game setup, let player define list of characters that children already know and can be used within game. There should be some "Setup" page with following subpages:
 - 1.1. Displays characters on keyboard where player can toggle which characters he wants to activate.
 - 1.2. Player chooses the range of words length and how many words to play with and game generates random words.
 - 1.3. Player confirms the words or edit them.
2. Let Player run the game
 - 2.1 Render pexeso based on the words selected in setup.
 - 2.2 Read words on pexeso chard when it is chosen.

## Current Implementation

Implemented: **2.1 Game Board**

The main game is now playable by clicking "Play Game" in the top bar. Features:
- Displays shuffled cards in a responsive grid
- Each word from setup appears twice for matching
- Cards flip with animation on click
- Tracks moves and matched pairs
- Prevents invalid moves (clicking revealed/matched cards)
- Shows win dialog with stats when complete
- Option to reset game or return to setup

Implemented: **1.1 Character Selection**

Navigate to `Setup` (top bar) then **Select Characters** to open the keyboard grid. Click any character button to toggle inclusion. Selected characters are highlighted and stored globally (persisting while the session stays active) via a Nuxt composable in `composables/useCharacters.ts`.

Implemented: **1.2 Word Generation**

After selecting characters, go to **Generate Words** on the Setup page. Adjust:
- Min Length / Max Length (range of word sizes)
- Words Count (how many unique random words to create)

Words are randomly assembled from selected characters using `composables/useWordSetup.ts` ensuring uniqueness and basic diversity (multi-character words must contain at least two distinct letters). Limits: max 50 words, attempts capped to avoid infinite loops.

Implemented: **1.3 Word Confirmation & Editing & Persistence**

Use the **Confirm** step to review generated words:
- Inline edit each word (validation ensures only selected characters are used and word length is within range; longer words require at least 2 distinct characters).
- Remove unwanted words.
- Add new custom words manually (must pass same validation rules).
- Confirm the list (stored in `state.confirmedWords` via `useWordSetup`).

Persistence:

- Selected characters persist in `localStorage` under key `pexeso_active_chars`.
- Generated and confirmed words persist under key `pexeso_words_state_v1` (structure: `{ words: string[], confirmedWords: string[] }`).
- You can reload the app or navigate directly to `/setup/confirm` and the previously generated words and confirmed selection will be restored.

After confirmation, the list is locked (until further edits) and ready for game board generation in phase 2.

## 🚀 Tech Stack

- **Nuxt 3** - The Intuitive Vue Framework
- **TypeScript** - Type-safe JavaScript
- **Vuetify 3** - Material Design component framework
- **Vue 3** - The Progressive JavaScript Framework
- **@nuxt/icon** - Icon module with 200,000+ icons

## 📦 Setup

Install dependencies:

```bash
npm install
```

## 💻 Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## 🏗️ Production

Build the application for production:

```bash
npm run build
```

