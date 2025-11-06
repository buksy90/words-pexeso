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

  const isVowel = (char: string): boolean => {
    return ['a', 'e', 'i', 'o', 'u', 'y'].includes(char.toLowerCase());
  };

  const hasConsecutiveConsonants = (word: string): boolean => {
    const chars = word.split('');
    for (let i = 0; i < chars.length - 1; i++) {
      const current = chars[i];
      const next = chars[i + 1];
      if (current && next && !isVowel(current) && !isVowel(next)) {
        return true;
      }
    }
    return false;
  };

  const generateWords = () => {
    if (!active.value.length) return;
    if (state.value.minLength < 1) state.value.minLength = 1;
    if (state.value.maxLength < state.value.minLength) state.value.maxLength = state.value.minLength;
    if (state.value.count < 1) state.value.count = 1;
    if (state.value.count > 50) state.value.count = 50; // safety cap

    state.value.generating = true;

    const wordsSet = new Set<string>();
    const maxAttempts = state.value.count * 200; // increased attempts due to stricter rules
    let attempts = 0;

    while (wordsSet.size < state.value.count && attempts < maxAttempts) {
      const len = randInt(state.value.minLength, state.value.maxLength);
      let chars: string[] = [];

      // First letter can be anything
      const firstCharIndex = randInt(0, active.value.length - 1);
      const firstChar = active.value[firstCharIndex];
      if (firstChar) chars.push(firstChar);

      // For remaining letters, ensure no consecutive consonants
      let validWord = firstChar !== undefined;
      if (validWord) {
        for (let i = 1; i < len; i++) {
          let validChar = false;
          let charAttempts = 0;
          const maxCharAttempts = 20;
          const prevChar = chars[i - 1];

          while (!validChar && charAttempts < maxCharAttempts && prevChar) {
            const nextCharIndex = randInt(0, active.value.length - 1);
            const nextChar = active.value[nextCharIndex];

            if (nextChar) {
              // If last char was consonant, next must be vowel
              if (!isVowel(prevChar)) {
                validChar = isVowel(nextChar);
              } else {
                // If last char was vowel, any char is valid
                validChar = true;
              }

              if (validChar) {
                chars.push(nextChar);
              }
            }
            charAttempts++;
          }

          if (!validChar) {
            validWord = false;
            break;
          }
        }
      }

      if (!validWord) {
        attempts++;
        continue;
      }

      const word = chars.join('');

      // simple heuristic: ensure at least 2 distinct chars if length > 2
      if (len > 2) {
        const distinct = new Set(chars);
        if (distinct.size < 2) {
          attempts++;
          continue;
        }
      }

      // Double-check no consecutive consonants
      if (!hasConsecutiveConsonants(word)) {
        wordsSet.add(word);
      }
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
