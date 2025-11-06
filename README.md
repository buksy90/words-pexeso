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

Implemented: **1.1 Character Selection**

Navigate to `Setup` (top bar) then **Select Characters** to open the keyboard grid. Click any character button to toggle inclusion. Selected characters are highlighted and stored globally (persisting while the session stays active) via a Nuxt composable in `composables/useCharacters.ts`.

Next planned steps: 1.2 word length & count selection, generation of candidate words using active characters.

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

