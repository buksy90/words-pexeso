import type { Ref } from 'vue';
import { onMounted, watch } from 'vue';
import { useCharacters } from './useCharacters';

export interface WordSetupState {
  minLength: number;
  maxLength: number;
  count: number;
  words: string[];
  confirmedWords: string[];
  dirty: boolean;
  generating: boolean;
}

export function useWordSetup() {
  // persistent state across pages
  const state: Ref<WordSetupState> = useState<WordSetupState>('wordSetup', () => ({
    minLength: 1,
    maxLength: 4,
    count: 8,
    words: [],
    confirmedWords: [],
    dirty: false,
    generating: false
  }));

  const { active } = useCharacters();

  const STORAGE_KEY = 'pexeso_words_state_v1';

  onMounted(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.words)) state.value.words = parsed.words.filter((w: any) => typeof w === 'string');
          if (Array.isArray(parsed.confirmedWords)) state.value.confirmedWords = parsed.confirmedWords.filter((w: any) => typeof w === 'string');
        }
      }
    } catch (e) {
      // ignore malformed data
    }
  });

  watch(() => [state.value.words, state.value.confirmedWords], () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        words: state.value.words,
        confirmedWords: state.value.confirmedWords,
      }));
    } catch (e) {
      // quota errors ignored
    }
  }, { deep: true });

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
    state.value.dirty = true;
    state.value.generating = false;
  };

  const clearWords = () => {
    state.value.words = [];
    state.value.confirmedWords = [];
    state.value.dirty = false;
  };

  const validateWord = (w: string): boolean => {
    if (!w) return false;
    if (w.length < state.value.minLength || w.length > state.value.maxLength) return false;
    // ensure every character is from active set
    for (const ch of w) {
      if (!active.value.includes(ch)) return false;
    }
    // simple diversity rule same as generation (if >2 length must have 2 distinct)
    if (w.length > 2) {
      const distinct = new Set(w.split(''));
      if (distinct.size < 2) return false;
    }
    return true;
  };

  const updateWord = (index: number, newWord: string) => {
    if (index < 0 || index >= state.value.words.length) return;
    state.value.words[index] = newWord.trim();
    state.value.dirty = true;
  };

  const removeWord = (index: number) => {
    if (index < 0 || index >= state.value.words.length) return;
    state.value.words.splice(index, 1);
    state.value.dirty = true;
  };

  const addWord = (w: string) => {
    const word = w.trim();
    if (!word) return;
    state.value.words.push(word);
    state.value.dirty = true;
  };

  const confirmWords = () => {
    // filter only valid words
    state.value.confirmedWords = state.value.words.filter(validateWord);
    state.value.dirty = false;
  };

  const hasInvalid = () => state.value.words.some(w => !validateWord(w));

  return { state, generateWords, clearWords, validateWord, updateWord, removeWord, addWord, confirmWords, hasInvalid };
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
