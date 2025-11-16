import { describe, it, expect } from 'vitest';
import { ref } from 'vue';

import { usePexesoGame } from '../composables/usePexesoGame';
import { fi } from 'vuetify/locale';

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

  const game = usePexesoGame(sharedWordState);

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

    const firstIndice = indicesAA[0]!;
    const secondIndice = indicesAA[1]!;
    const firstCard = game.shuffledCards.value[firstIndice]!;
    const secondCard = game.shuffledCards.value[secondIndice]!;

    // Flip first 'aa'
    expect(firstCard.isRevealed).toBe(false);
    game.flipCard(indicesAA[0]!);
    expect(firstCard.isRevealed).toBe(true);

    // Flip second 'aa' to create match
    expect(secondCard.isRevealed).toBe(false);
    game.flipCard(secondIndice);
    expect(secondCard.isRevealed).toBe(true);

    expect(firstCard.isMatched).toBe(true);
    expect(secondCard.isMatched).toBe(true);
    expect(game.matchedPairs.value).toBe(1);
  });
});
