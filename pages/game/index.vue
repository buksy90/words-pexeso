<!--
  Game board page that renders pexeso cards in a grid based on confirmed words.
  Each word appears twice for matching.
-->
<template>
  <v-container class="py-8">
    <div v-if="!confirmedWords.length" class="text-center">
      <v-alert type="warning" variant="tonal" class="mb-6">
        No words are ready for the game. Please complete the setup first.
      </v-alert>
      <v-btn color="primary" :to="'/setup'">Go to Setup</v-btn>
    </div>
    <template v-else>
      <!-- Game Stats -->
      <v-row class="mb-6">
        <v-col cols="12" sm="3">
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1">Moves</div>
            <div class="text-h5">{{ moves }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1">Matched Pairs</div>
            <div class="text-h5">{{ matchedPairs }} / {{ totalPairs }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selectedVoice"
            :items="availableVoices"
            item-title="label"
            item-value="value"
            label="Voice / Accent"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" sm="3" class="d-flex justify-end align-center">
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-restart"
            @click="resetGame"
            :disabled="!gameStarted"
          >Reset Game</v-btn>
        </v-col>
      </v-row>

      <!-- Game Grid -->
      <v-row
        class="game-grid"
        :class="{'game-won': isGameWon, 'waiting-for-click': waitingForClick}"
        @click="handleBoardClick"
      >
        <v-col
          v-for="(card, index) in shuffledCards"
          :key="index"
          cols="6" sm="4" md="3" lg="2"
        >
          <div
            class="card-flip"
            :class="{
              'is-flipped': card.isRevealed,
              'is-matched': card.isMatched
            }"
            @click.stop="flipCard(index)"
          >
            <div class="card-inner">
              <div class="card-front">
                <v-card
                  variant="outlined"
                  class="d-flex align-center justify-center"
                  height="120"
                >
                  <v-icon size="40" color="primary">mdi-help</v-icon>
                </v-card>
              </div>
              <div class="card-back">
                <v-card
                  :color="card.isMatched ? 'success' : 'primary'"
                  class="d-flex align-center justify-center"
                  height="120"
                >
                  <span
                    class="text-h5 card-word"
                    :style="{ fontFamily: settings.fontFamily }"
                  >{{ card.word }}</span>
                </v-card>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Win Dialog -->
      <v-dialog v-model="showWinDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="text-h5">Congratulations! 🎉</v-card-title>
          <v-card-text>
            <p class="mb-2">You've completed the game!</p>
            <p class="text-body-2">
              Moves: {{ moves }}<br>
              Pairs Matched: {{ matchedPairs }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="resetGame">Play Again</v-btn>
            <v-btn color="secondary" :to="'/setup'">Back to Setup</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useWordSetup } from '~/composables/useWordSetup';
import { useGameSettings } from '~/composables/useGameSettings';

const { state } = useWordSetup();
const { settings } = useGameSettings();

interface GameCard {
  word: string;
  isRevealed: boolean;
  isMatched: boolean;
}

interface VoiceOption {
  label: string;
  value: string;
  voice: SpeechSynthesisVoice | null;
}

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

// Get confirmed words from setup
const confirmedWords = computed(() => state.value.confirmedWords);
const totalPairs = computed(() => confirmedWords.value.length);
const gameStarted = computed(() => moves.value > 0);
const isGameWon = computed(() => matchedPairs.value === totalPairs.value);

  // Create and shuffle cards (each word appears twice)
const shuffledCards = ref<GameCard[]>([]);

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
      voiceOptions.find(v => v.voice?.lang.startsWith('sk')) || // Slovak
      voiceOptions.find(v => v.voice?.lang.startsWith('cs')) || // Czech (similar)
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
  utterance.rate = 0.8; // Slightly slower
  utterance.pitch = 1.1; // Slightly higher pitch
  utterance.volume = 1.0;

  speechSynthesis.value.speak(utterance);
};

// Initialize game
const initGame = () => {
  // Create pairs of cards
  const cards: GameCard[] = [];
  confirmedWords.value.forEach(word => {
    // Add each word twice for matching
    for (let i = 0; i < 2; i++) {
      cards.push({
        word,
        isRevealed: false,
        isMatched: false
      });
    }
  });

  // Shuffle cards using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = cards[i]!;
    cards[i] = cards[j]!;
    cards[j] = temp;
  }  shuffledCards.value = cards;
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
    // Flip back the non-matching cards
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

// Check if a card can be flipped
const canFlipCard = (index: number) => {
  const card = shuffledCards.value[index];
  if (!card) return false;
  return !isLocked.value &&
         !card.isMatched &&
         !card.isRevealed &&
         index !== firstCard.value;
};

// Handle card flip
const flipCard = (index: number) => {
  if (!canFlipCard(index)) return;

  const card = shuffledCards.value[index];
  if (!card) return;
  card.isRevealed = true;

  // Speak the word when card is flipped
  speakWord(card.word);

  if (firstCard.value === null) {
    // First card flipped
    firstCard.value = index;
  } else {
    // Second card flipped
    secondCard.value = index;
    moves.value++;

    // Check for match
    const card1 = firstCard.value !== null ? shuffledCards.value[firstCard.value] : null;
    const card2 = card;

    if (card1 && card2 && card1.word === card2.word) {
      // Match found
      card1.isMatched = true;
      card2.isMatched = true;
      matchedPairs.value++;
      // Reset for next pair
      firstCard.value = null;
      secondCard.value = null;
    } else {
      // No match - wait for player to click anywhere to continue
      isLocked.value = true;
      waitingForClick.value = true;
    }
  }
};

// Watch for game win
watch(isGameWon, (won) => {
  if (won) {
    showWinDialog.value = true;
  }
});

// Initialize voices and game on mount
onMounted(() => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    loadVoices();

    // Voices may load asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
});

// Initialize on mount
initGame();
</script>

<style scoped>
.game-grid {
  perspective: 1000px;
}

.card-flip {
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  height: 120px;
  position: relative;
}

.card-flip.is-flipped {
  transform: rotateY(180deg);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.game-won .card-flip {
  animation: celebrate 1s ease-in-out;
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.card-word {
  font-weight: bold;
  letter-spacing: 0.05em;
}

.waiting-for-click {
  cursor: pointer;
}

.waiting-for-click::after {
  content: 'Click anywhere to continue...';
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  z-index: 1000;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>