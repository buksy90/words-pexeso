<!--
  Spell Game page - Players see an image and must select letters in correct order
  to spell the word represented by the image.
-->
<template>
  <v-container class="py-8">
    <!-- Start Screen - Difficulty Selection -->
    <div v-if="!gameStarted" class="text-center">
      <h1 class="text-h3 mb-4">Spell the Word Game</h1>
      <p class="text-h6 text-grey mb-6">
        Look at the picture and spell the word by selecting letters in the correct order!
      </p>
      <p class="text-subtitle-1 mb-8">Choose your difficulty level:</p>

      <v-row justify="center" class="mb-4">
        <v-col cols="12" md="4">
          <v-card
            class="difficulty-card pa-6"
            hover
            elevation="4"
            @click="handleStartGame('easy')"
          >
            <v-icon size="x-large" color="success" class="mb-3">mdi-emoticon-happy</v-icon>
            <h3 class="text-h5 mb-3">Easy</h3>
            <p class="text-body-1">
              Only the correct letters are displayed.
              Perfect for beginners!
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            class="difficulty-card pa-6"
            hover
            elevation="4"
            @click="handleStartGame('medium')"
          >
            <v-icon size="x-large" color="warning" class="mb-3">mdi-emoticon-neutral</v-icon>
            <h3 class="text-h5 mb-3">Medium</h3>
            <p class="text-body-1">
              Correct letters + 2 incorrect letters.
              A bit more challenging!
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            class="difficulty-card pa-6"
            hover
            elevation="4"
            @click="handleStartGame('hard')"
          >
            <v-icon size="x-large" color="error" class="mb-3">mdi-emoticon-cool</v-icon>
            <h3 class="text-h5 mb-3">Hard</h3>
            <p class="text-body-1">
              Correct letters + up to 5 incorrect letters.
              For spelling masters!
            </p>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Game Screen -->
    <template v-else>
      <!-- Progress Bar -->
      <v-card class="mb-4" variant="outlined">
        <v-card-text class="pb-2">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1 font-weight-bold">Progress</span>
            <span class="text-subtitle-2">{{ completedWordsCount }} / {{ totalWords }} words</span>
          </div>
          <v-progress-linear
            :model-value="progressPercentage"
            color="success"
            height="12"
            rounded
          >
            <template v-slot:default>
              <strong class="text-caption">{{ progressPercentage }}%</strong>
            </template>
          </v-progress-linear>
        </v-card-text>
      </v-card>

      <!-- Game Stats -->
      <v-row class="mb-6">
        <v-col cols="12" sm="3">
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1">Score</div>
            <div class="text-h5">{{ score }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1">Attempts</div>
            <div class="text-h5">{{ attempts }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card variant="outlined" class="pa-4" color="success" v-if="isCorrect === null">
            <div class="text-subtitle-1">Potential Points</div>
            <div class="text-h5">{{ potentialPoints }}</div>
          </v-card>
          <v-card variant="outlined" class="pa-4" v-else>
            <div class="text-subtitle-1">Potential Points</div>
            <div class="text-h5">{{ potentialPoints }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3" class="d-flex align-center justify-end">
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-restart"
            @click="handleStartGame(difficulty)"
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
              <div v-if="currentThing" class="d-flex justify-center align-center gap-2 mt-4">
                <v-select
                  v-model="selectedVoice"
                  :items="availableVoices"
                  item-title="label"
                  item-value="value"
                  label="Voice"
                  variant="outlined"
                  density="compact"
                  class="mr-3"
                  style="max-width: 300px;"
                  hide-details
                />
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-volume-high"
                  @click="handleListen"
                >
                  Listen
                </v-btn>
              </div>
            </div>

            <!-- Selected Letters Display -->
            <div class="text-center mb-6">
              <h3 class="text-h6 mb-3">Your Word:</h3>
              <div class="selected-letters-container">
                <div
                  v-for="(tile, index) in selectedLetters"
                  :key="`pos-${index}`"
                  class="letter-tile"
                  :class="{
                    'selected-tile': tile !== null,
                    'empty-tile': tile === null,
                    'next-position': index === activePosition && isCorrect === null && tile === null,
                    'correct-tile': isCorrect === true && tile !== null,
                    'incorrect-tile': isCorrect === false && tile !== null,
                    'clickable': isCorrect === null
                  }"
                  @click="handlePositionClick(index)"
                >
                  {{ tile?.letter || '_' }}
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
                color="success"
                size="large"
                prepend-icon="mdi-check"
                class="mr-2"
                @click="checkWord"
                :disabled="selectedLetters.length === 0"
              >
                Check
              </v-btn>
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
                v-if="isCorrect === true"
                color="primary"
                size="large"
                prepend-icon="mdi-arrow-right"
                @click="nextRound"
              >
                Next Word
              </v-btn>
              <v-btn
                v-if="isCorrect === false"
                color="warning"
                size="large"
                prepend-icon="mdi-refresh"
                @click="resetRound"
              >
                Try Again
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useSpellGame, type Difficulty } from '~/composables/useSpellGame'
import { useSpeech } from '~/composables/useSpeech'

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
  activePosition,
  difficulty,
  potentialPoints,
  completedWordsCount,
  totalWords,
  progressPercentage,

  // Actions
  startGame,
  selectLetter,
  undoLastLetter,
  removeSelectedLetter,
  setActivePosition,
  checkWord,
  resetRound,
  nextRound,
} = useSpellGame()

// Text-to-speech
const { speak, availableVoices, selectedVoice } = useSpeech('spell_game_voice')

const handleStartGame = (selectedDifficulty: Difficulty) => {
  startGame(selectedDifficulty)
}

const handlePositionClick = (index: number) => {
  if (isCorrect.value !== null) return

  const tile = selectedLetters.value[index]
  if (tile !== null) {
    // Remove letter at this position
    removeSelectedLetter(index)
  } else {
    // Set this as the active position
    setActivePosition(index)
  }
}

// Listen button handler
const handleListen = () => {
  if (targetWord.value) {
    speak(targetWord.value)
  }
}

// Keyboard event handler
const handleKeyPress = (event: KeyboardEvent) => {
  if (!gameStarted.value || isCorrect.value !== null) return

  const key = event.key.toLowerCase()

  // Find the first available (not selected) letter tile that matches the pressed key
  const availableTile = letterQueue.value.find(
    tile => !tile.selected && tile.letter.toLowerCase() === key
  )

  if (availableTile) {
    selectLetter(availableTile)
  }
}

// Add keyboard event listener on mount, remove on unmount
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
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

.letter-tile.clickable {
  cursor: pointer;
}

.selected-tile.clickable:hover {
  background: #1976D2;
  transform: scale(0.95);
}

.empty-tile.clickable:hover:not(.next-position) {
  background: #E8E8E8;
  border-color: #999;
}

.empty-tile {
  background: #f5f5f5;
  color: #9e9e9e;
  border: 2px dashed #bdbdbd;
}

.empty-tile.next-position {
  background: #E3F2FD;
  border: 2px dashed #2196F3;
  border-width: 3px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    border-color: #2196F3;
    background: #E3F2FD;
  }
  50% {
    border-color: #1976D2;
    background: #BBDEFB;
  }
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

.difficulty-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.difficulty-card:hover {
  transform: translateY(-8px);
}
</style>
