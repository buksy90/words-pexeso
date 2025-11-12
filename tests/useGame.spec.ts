import { describe, it, expect } from 'vitest';
import { ref } from 'vue';

import { useGame } from '../composables/useGame';

describe('useGame composable', () => {
  it('initializes cards for confirmed words and allows flips and matches', () => {
    // Shared mock state that matches the shape useGame expects
    const sharedWordState = ref({
      confirmedWords: ['aa', 'bb'],
      minLength: 1,
      maxLength: 4,
      count: 8,
      words: [],
      dirty: false,
      generating: false,
      duplicates: {}
    });

    const game = useGame(sharedWordState);

    // Explicitly initialize (composable initializes on construction but keep this)
    game.initGame?.();

    // Should have 4 cards (each word twice)
    expect(game.shuffledCards.value.length).toBe(4);

    // Find indices for word 'aa'
    const indicesAA = game.shuffledCards.value
      .map((c, i) => ({ c, i }))
      .filter(x => x.c.word === 'aa')
      .map(x => x.i);

    expect(indicesAA.length).toBe(2);

    // Flip first 'aa'
    game.flipCard(indicesAA[0]);
    expect(game.shuffledCards.value[indicesAA[0]].isRevealed).toBe(true);

    // Flip second 'aa' to create match
    game.flipCard(indicesAA[1]);
    expect(game.shuffledCards.value[indicesAA[0]].isMatched).toBe(true);
    expect(game.shuffledCards.value[indicesAA[1]].isMatched).toBe(true);
    expect(game.matchedPairs.value).toBe(1);
  });
});
