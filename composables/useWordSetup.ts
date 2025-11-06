import type { Ref } from 'vue';
import { useCharacters } from './useCharacters';

export interface WordSetupState {
  minLength: number;
  maxLength: number;
  count: number;
  words: string[];
  generating: boolean;
}

export function useWordSetup() {
  // persistent state across pages
  const state: Ref<WordSetupState> = useState<WordSetupState>('wordSetup', () => ({
    minLength: 3,
    maxLength: 5,
    count: 8,
    words: [],
    generating: false
  }));

  const { active } = useCharacters();

  const generateWords = () => {
    if (!active.value.length) return;
    if (state.value.minLength < 1) state.value.minLength = 1;
    if (state.value.maxLength < state.value.minLength) state.value.maxLength = state.value.minLength;
    if (state.value.count < 1) state.value.count = 1;
    if (state.value.count > 50) state.value.count = 50; // safety cap

    state.value.generating = true;

    const wordsSet = new Set<string>();
    const maxAttempts = state.value.count * 100; // avoid infinite loops
    let attempts = 0;

    while (wordsSet.size < state.value.count && attempts < maxAttempts) {
      const len = randInt(state.value.minLength, state.value.maxLength);
      let w = '';
      for (let i = 0; i < len; i++) {
        w += active.value[randInt(0, active.value.length - 1)];
      }
      // simple heuristic: ensure at least 2 distinct chars if length > 2
      if (len > 2) {
        const distinct = new Set(w.split(''));
        if (distinct.size < 2) {
          attempts++;
          continue;
        }
      }
      wordsSet.add(w);
      attempts++;
    }

    state.value.words = Array.from(wordsSet);
    state.value.generating = false;
  };

  const clearWords = () => {
    state.value.words = [];
  };

  return { state, generateWords, clearWords };
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
