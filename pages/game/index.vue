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
        <v-col cols="12" sm="2">
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
        <v-col cols="12" sm="2">
          <v-select
            v-model="gameSettings.fontSize"
            :items="FONT_SIZE_OPTIONS"
            item-title="name"
            item-value="value"
            label="Font Size"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" sm="2" class="d-flex justify-end align-center">
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
          <PexesoCard :card="card" :index="index" :settings="gameSettings" @flip="flipCard" />
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
import { usePexesoGame } from '~/composables/usePexesoGame';
import { useGameSettings } from '~/composables/useGameSettings';
import { FONT_SIZE_OPTIONS } from '~/composables/constants';
import PexesoCard from '~/components/PexesoCard.vue';
import { useWordSetup } from '~/composables/useWordSetup';

const gameSettings = useGameSettings();
const { state } = useWordSetup();

const {
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
  loadVoices,
  resetGame,
  handleBoardClick,
  flipCard,
} = usePexesoGame(state);
</script>

<style scoped>
.game-grid {
  perspective: 1000px;
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