import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import type { WordSetupState } from './useWordSetup';

interface PexesoGameCard {
  word: string;
  isRevealed: boolean;
  isMatched: boolean;
}

interface VoiceOption {
  label: string;
  value: string;
  voice: SpeechSynthesisVoice | null;
}

export function usePexesoGame(state: Ref<WordSetupState>) {
  // Game state
  const moves = ref(0);
  const matchedPairs = ref(0);
  const firstCard = ref<number | null>(null);
  const secondCard = ref<number | null>(null);
  const showWinDialog = ref(false);
  const isLocked = ref(false);
  const waitingForClick = ref(false);

  // Speech synthesis state
  const availableVoices = ref<VoiceOption[]>([]);
  const selectedVoice = ref<string>('');
  const speechSynthesis = ref<SpeechSynthesis | null>(null);

  // Confirmed words (source of truth)
  const confirmedWords = computed(() => state.value.confirmedWords);
  const totalPairs = computed(() => confirmedWords.value.length);
  const gameStarted = computed(() => moves.value > 0);
  const isGameWon = computed(() => matchedPairs.value === totalPairs.value);

  // Cards
  const shuffledCards = ref<PexesoGameCard[]>([]);

  // Load available voices
  const loadVoices = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    speechSynthesis.value = synth;

    const voices = synth.getVoices();

    // Filter and format voices
    const voiceOptions: VoiceOption[] = voices.map(voice => ({
      label: `${voice.name} (${voice.lang})`,
      value: voice.name,
      voice: voice
    }));

    availableVoices.value = voiceOptions;

    // Set default voice (prefer Slovak, then Czech, then first available)
    if (voiceOptions.length > 0) {
      const defaultVoice =
        voiceOptions.find(v => v.voice?.lang.startsWith('sk')) ||
        voiceOptions.find(v => v.voice?.lang.startsWith('cs')) ||
        voiceOptions[0];
      selectedVoice.value = defaultVoice?.value || '';

      // Load from localStorage
      const savedVoice = localStorage.getItem('pexeso_voice');
      if (savedVoice && voiceOptions.find(v => v.value === savedVoice)) {
        selectedVoice.value = savedVoice;
      }
    }
  };

  // Save voice preference
  watch(selectedVoice, (newVoice) => {
    if (typeof window !== 'undefined' && newVoice) {
      localStorage.setItem('pexeso_voice', newVoice);
    }
  });

  // Speak a word
  const speakWord = (word: string) => {
    if (typeof window === 'undefined' || !speechSynthesis.value || !word) return;

    // Cancel any ongoing speech
    speechSynthesis.value.cancel();

    const utterance = new SpeechSynthesisUtterance(word);

    // Find and set the selected voice
    const voiceOption = availableVoices.value.find(v => v.value === selectedVoice.value);
    if (voiceOption?.voice) {
      utterance.voice = voiceOption.voice;
    }

    // Adjust speech parameters for children
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    speechSynthesis.value.speak(utterance);
  };

  // Initialize game
  const initGame = () => {
    const cards: PexesoGameCard[] = [];
    confirmedWords.value.forEach(word => {
      for (let i = 0; i < 2; i++) {
        cards.push({ word, isRevealed: false, isMatched: false });
      }
    });

    // Shuffle cards (Fisher-Yates)
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = cards[i]!;
      cards[i] = cards[j]!;
      cards[j] = temp;
    }

    shuffledCards.value = cards;
    moves.value = 0;
    matchedPairs.value = 0;
    firstCard.value = null;
    secondCard.value = null;
    showWinDialog.value = false;
    isLocked.value = false;
    waitingForClick.value = false;
  };

  // Reset game
  const resetGame = () => {
    showWinDialog.value = false;
    initGame();
  };

  // Handle board click to flip cards back
  const handleBoardClick = () => {
    if (waitingForClick.value) {
      const card1 = firstCard.value !== null ? shuffledCards.value[firstCard.value] : null;
      const card2 = secondCard.value !== null ? shuffledCards.value[secondCard.value] : null;

      if (card1) card1.isRevealed = false;
      if (card2) card2.isRevealed = false;

      firstCard.value = null;
      secondCard.value = null;
      waitingForClick.value = false;
      isLocked.value = false;
    }
  };

  // Can flip
  const canFlipCard = (index: number) => {
    const card = shuffledCards.value[index];
    if (!card) return false;
    return !isLocked.value && !card.isMatched && !card.isRevealed && index !== firstCard.value;
  };

  // Flip card
  const flipCard = (index: number) => {
    if (!canFlipCard(index)) return;

    const card = shuffledCards.value[index];
    if (!card) return;
    card.isRevealed = true;

    // Speak the word
    speakWord(card.word);

    if (firstCard.value === null) {
      firstCard.value = index;
    } else {
      secondCard.value = index;
      moves.value++;

      const card1 = firstCard.value !== null ? shuffledCards.value[firstCard.value] : null;
      const card2 = card;

      if (card1 && card2 && card1.word === card2.word) {
        card1.isMatched = true;
        card2.isMatched = true;
        matchedPairs.value++;
        firstCard.value = null;
        secondCard.value = null;
      } else {
        isLocked.value = true;
        waitingForClick.value = true;
      }
    }
  };

  // Watch win
  watch(isGameWon, (won) => {
    if (won) showWinDialog.value = true;
  });

  // Re-init when confirmed words change
  watch(confirmedWords, () => {
    initGame();
  });

  // Initialize voices (if available) and game immediately. This avoids relying on
  // Vue lifecycle hooks so the composable is test-friendly.
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  // Initialize game state
  initGame();

  return {
    // state
    moves,
    matchedPairs,
    showWinDialog,
    waitingForClick,
    availableVoices,
    selectedVoice,
    shuffledCards,
    confirmedWords,
    totalPairs,
    gameStarted,
    isGameWon,
    // actions
    loadVoices,
    speakWord,
    initGame,
    resetGame,
    handleBoardClick,
    flipCard,
  } as const;
}
