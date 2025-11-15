import { ref, computed, watch, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import type { WordSetupState } from './useWordSetup';
import { useSpeech } from './useSpeech';

interface PexesoGameCard {
  word: string;
  isRevealed: boolean;
  isMatched: boolean;
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

  // Speech synthesis
  const { availableVoices, selectedVoice, speak } = useSpeech('pexeso_voice');

  // Confirmed words (source of truth)
  const confirmedWords = computed(() => state.value.confirmedWords);
  const totalPairs = computed(() => confirmedWords.value.length);
  const gameStarted = computed(() => moves.value > 0);
  const isGameWon = computed(() => matchedPairs.value === totalPairs.value);

  // Cards
  const shuffledCards = ref<PexesoGameCard[]>([]);

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
    speak(card.word);

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

  // Initialize game state
  initGame();

  // Register a document click listener so clicks anywhere in the app
  // will trigger `handleBoardClick`. We remove the listener on unmount
  // so the composable does not leak handlers between component mounts.
  if (typeof document !== 'undefined') {
    const onDocumentClick = () => handleBoardClick();
    document.addEventListener('click', onDocumentClick);
    onUnmounted(() => {
      document.removeEventListener('click', onDocumentClick);
    });
  }

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
    speak,
    initGame,
    resetGame,
    handleBoardClick,
    flipCard,
  } as const;
}
