<!--
  Spell Game page - Players see an image and must select letters in correct order
  to spell the word represented by the image.
-->
<template>
  <v-container class="py-8">
    <!-- Start Screen -->
    <div v-if="!gameStarted" class="text-center">
      <h1 class="text-h3 mb-4">Spell the Word Game</h1>
      <p class="text-h6 text-grey mb-8">
        Look at the picture and spell the word by selecting letters in the correct order!
      </p>
      <v-btn
        color="primary"
        size="x-large"
        prepend-icon="mdi-play"
        @click="startGame"
      >
        Start Game
      </v-btn>
    </div>

    <!-- Game Screen -->
    <template v-else>
      <!-- Game Stats -->
      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1">Score</div>
            <div class="text-h5">{{ score }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1">Attempts</div>
            <div class="text-h5">{{ attempts }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" class="d-flex align-center justify-end">
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-restart"
            @click="startGame"
          >
            New Game
          </v-btn>
        </v-col>
      </v-row>

      <!-- Game Content -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-6">
            <!-- Image Display -->
            <div class="text-center mb-6">
              <v-img
                v-if="currentThing"
                :src="currentThing.imagePath"
                :alt="targetWord"
                max-width="400"
                max-height="400"
                class="mx-auto rounded-lg elevation-4"
                cover
              />
            </div>

            <!-- Selected Letters Display -->
            <div class="text-center mb-6">
              <h3 class="text-h6 mb-3">Your Word:</h3>
              <div class="selected-letters-container">
                <div
                  v-for="(tile, index) in selectedLetters"
                  :key="`selected-${tile.id}`"
                  class="letter-tile selected-tile"
                  :class="{
                    'correct-tile': isCorrect === true,
                    'incorrect-tile': isCorrect === false
                  }"
                >
                  {{ tile.letter }}
                </div>
                <div
                  v-for="i in (targetWord.length - selectedLetters.length)"
                  :key="`empty-${i}`"
                  class="letter-tile empty-tile"
                >
                  _
                </div>
              </div>
            </div>

            <!-- Feedback Messages -->
            <v-alert
              v-if="isCorrect === true"
              type="success"
              variant="tonal"
              class="mb-4"
              prominent
            >
              <div class="text-h6">🎉 Excellent! That's correct!</div>
            </v-alert>
            <v-alert
              v-if="isCorrect === false"
              type="error"
              variant="tonal"
              class="mb-4"
              prominent
            >
              <div class="text-h6">❌ Not quite right. Try again!</div>
            </v-alert>

            <!-- Letter Queue -->
            <div v-if="isCorrect === null" class="text-center mb-4">
              <h3 class="text-h6 mb-3">Select Letters:</h3>
              <div class="letter-queue">
                <v-btn
                  v-for="tile in letterQueue"
                  :key="`queue-${tile.id}`"
                  :disabled="tile.selected"
                  :variant="tile.selected ? 'outlined' : 'elevated'"
                  :color="tile.selected ? 'grey' : 'primary'"
                  size="x-large"
                  class="letter-queue-btn"
                  @click="selectLetter(tile)"
                >
                  {{ tile.letter }}
                </v-btn>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center mt-6">
              <v-btn
                v-if="isCorrect === null"
                color="warning"
                variant="outlined"
                prepend-icon="mdi-undo"
                class="mr-2"
                @click="undoLastLetter"
                :disabled="selectedLetters.length === 0"
              >
                Undo
              </v-btn>
              <v-btn
                v-if="isCorrect === null"
                color="error"
                variant="outlined"
                prepend-icon="mdi-refresh"
                @click="resetRound"
                :disabled="selectedLetters.length === 0"
              >
                Reset
              </v-btn>
              <v-btn
                v-if="isCorrect !== null"
                color="primary"
                size="large"
                prepend-icon="mdi-arrow-right"
                @click="nextRound"
              >
                Next Word
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useSpellGame } from '~/composables/useSpellGame'

const {
  // State
  currentThing,
  letterQueue,
  selectedLetters,
  isCorrect,
  attempts,
  score,
  gameStarted,
  targetWord,

  // Actions
  startGame,
  selectLetter,
  undoLastLetter,
  resetRound,
  nextRound,
} = useSpellGame()
</script>

<style scoped>
.selected-letters-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  min-height: 80px;
  align-items: center;
}

.letter-tile {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.selected-tile {
  background: #2196F3;
  color: white;
  border: 2px solid #1976D2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

.empty-tile {
  background: #f5f5f5;
  color: #9e9e9e;
  border: 2px dashed #bdbdbd;
}

.correct-tile {
  background: #4CAF50 !important;
  border-color: #388E3C !important;
  animation: bounce 0.5s ease;
}

.incorrect-tile {
  background: #f44336 !important;
  border-color: #d32f2f !important;
  animation: shake 0.5s ease;
}

.letter-queue {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.letter-queue-btn {
  min-width: 60px !important;
  min-height: 60px !important;
  font-size: 24px !important;
  font-weight: bold;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
</style>
