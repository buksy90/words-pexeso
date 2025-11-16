<template>
  <v-container class="py-8">
    <div v-if="!gameStarted" class="text-center">
      <h1 class="text-h3 mb-4">Listening Game</h1>
      <p class="text-h6 text-grey mb-6">
        Listen to the spoken word and select letters in the correct order.
      </p>

      <p v-if="!hasWords" class="text-body-1 mb-6">No confirmed words available. Please go to Setup and confirm some words first.</p>

      <v-row justify="center" class="mb-4" v-if="hasWords">
        <v-col cols="12" md="4">
          <v-card class="difficulty-card pa-6" hover elevation="4" @click="handleStartGame('easy')">
            <v-icon size="x-large" color="success" class="mb-3">mdi-ear-hearing</v-icon>
            <h3 class="text-h5 mb-3">Easy</h3>
            <p class="text-body-1">Only correct letters are displayed.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="difficulty-card pa-6" hover elevation="4" @click="handleStartGame('medium')">
            <v-icon size="x-large" color="warning" class="mb-3">mdi-ear-hearing</v-icon>
            <h3 class="text-h5 mb-3">Medium</h3>
            <p class="text-body-1">Correct letters + 2 incorrect letters.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="difficulty-card pa-6" hover elevation="4" @click="handleStartGame('hard')">
            <v-icon size="x-large" color="error" class="mb-3">mdi-ear-hearing</v-icon>
            <h3 class="text-h5 mb-3">Hard</h3>
            <p class="text-body-1">Correct letters + up to 5 incorrect letters.</p>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-6" v-if="!hasWords">
        <v-col cols="12" class="text-center">
          <v-btn color="primary" :to="'/setup'">Go to Setup</v-btn>
        </v-col>
      </v-row>
    </div>

    <template v-else>
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1">Progress</div>
            <div class="text-h5">{{ progress }} / 10</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="mb-4" variant="outlined">
            <v-card-text class="pb-2">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-1">Listening Progress</span>
              </div>
              <v-progress-linear :model-value="(progress/10) * 100" color="primary" height="24" rounded />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" class="d-flex align-center justify-end">
          <v-btn color="error" variant="outlined" prepend-icon="mdi-restart" @click="handleStartGame(difficulty)">
            New Game
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="pa-6">
            <div class="text-center mb-6">
              <div class="d-flex justify-center align-center gap-2 mt-4">
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
                <v-btn color="primary" variant="outlined" prepend-icon="mdi-volume-high" @click="handleListen">Listen</v-btn>
              </div>
            </div>

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
                  {{ tile?.letter ? tile.letter.toUpperCase() : '_' }}
                </div>
              </div>
            </div>

            <v-alert v-if="isCorrect === true" type="success" variant="tonal" class="mb-4" prominent>
              <div class="text-h6">🎉 Correct! Progress increased.</div>
            </v-alert>
            <v-alert v-if="isCorrect === false" type="error" variant="tonal" class="mb-4" prominent>
              <div class="text-h6">❌ Incorrect. Progress decreased.</div>
            </v-alert>

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
                  {{ tile.letter.toUpperCase() }}
                </v-btn>
              </div>
            </div>

            <div class="text-center mt-6">
              <v-btn v-if="isCorrect === null" color="success" size="large" prepend-icon="mdi-check" class="mr-2" @click="checkWord" :disabled="selectedLetters.length === 0">Check</v-btn>
              <v-btn v-if="isCorrect === null" color="error" variant="outlined" prepend-icon="mdi-refresh" @click="resetRound" :disabled="selectedLetters.length === 0">Reset</v-btn>
              <v-btn v-if="isCorrect === true" color="primary" size="large" prepend-icon="mdi-arrow-right" @click="nextRound">Next Word</v-btn>
              <v-btn v-if="isCorrect === false" color="warning" size="large" prepend-icon="mdi-refresh" @click="resetRound">Try Again</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useWordSetup } from '~/composables/useWordSetup'
import { useCharacters } from '~/composables/useCharacters'
import { useLettersQueue, type LetterTile } from '~/composables/useLettersQueue'
import { useSpeech } from '~/composables/useSpeech'

type Difficulty = 'easy' | 'medium' | 'hard'

// Word source
const { state } = useWordSetup()
const confirmedWords = computed(() => state.value.confirmedWords || [])
const hasWords = computed(() => confirmedWords.value.length > 0)

// Speech
const { speak, availableVoices, selectedVoice } = useSpeech('listen_game_voice')

// Game state
const currentWord = ref('')
const selectedLetters = ref<(LetterTile | null)[]>([])
const isCorrect = ref<boolean | null>(null)
const gameStarted = ref(false)
const activePosition = ref(0)
const difficulty = ref<Difficulty>('easy')
const progress = ref(0)

// reuse letters queue
const { letterQueue, setQueue, availableLetters, selectLetter, removeSelectedLetter, setActivePosition, resetSelections } = useLettersQueue(selectedLetters, activePosition, isCorrect)

const { active } = useCharacters()

const getIncorrectLetters = (wordLetters: string[]): string[] => {
  const incorrectCount = difficulty.value === 'medium' ? 2 : difficulty.value === 'hard' ? 5 : 0
  if (incorrectCount === 0) return []

  const wordLetterSet = new Set(wordLetters.map(l => l.toLowerCase()))
  const availableChars = active.value.filter(char => !wordLetterSet.has(char.toLowerCase()))
  // shuffle simple
  const shuffled = availableChars.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(incorrectCount, shuffled.length))
}

const initRound = (excludeCurrent = true) => {
  if (!hasWords.value) return
  // pick random confirmed word; prefer a different word than current when possible
  let idx = Math.floor(Math.random() * confirmedWords.value.length)
  if (excludeCurrent && confirmedWords.value.length > 1) {
    let attempts = 0
    while (confirmedWords.value[idx] === currentWord.value && attempts < 50) {
      idx = Math.floor(Math.random() * confirmedWords.value.length)
      attempts++
    }
  }
  const word = confirmedWords.value[idx] || ''
  currentWord.value = word
  selectedLetters.value = Array(word.length).fill(null)
  isCorrect.value = null
  activePosition.value = 0

  const letters = word.split('').map((letter, index) => ({ letter, id: index, selected: false } as LetterTile))
  const incorrect = getIncorrectLetters(letters.map(l => l.letter))
  const incorrectTiles = incorrect.map((letter, i) => ({ letter, id: letters.length + i, selected: false } as LetterTile))
  setQueue([...letters, ...incorrectTiles])
}

const startGame = (selectedDifficulty: Difficulty = 'easy') => {
  difficulty.value = selectedDifficulty
  progress.value = 0
  gameStarted.value = true
  initRound()
}

const checkWord = () => {
  const spelled = selectedLetters.value.map(t => t?.letter || '').join('')
  if (!spelled) return
  const correct = spelled === currentWord.value
  isCorrect.value = correct
  if (correct) {
    progress.value = Math.min(10, progress.value + 1)
  } else {
    progress.value = Math.max(0, progress.value - 1)
  }
}

const nextRound = () => {
  if (isCorrect.value === null) return
  initRound()
}

const resetRound = () => {
  resetSelections(currentWord.value.length)
  isCorrect.value = null
}

const handleStartGame = (d: Difficulty) => startGame(d)

const handlePositionClick = (index: number) => {
  if (isCorrect.value !== null) return
  const tile = selectedLetters.value[index]
  if (tile !== null) {
    removeSelectedLetter(index)
  } else {
    setActivePosition(index)
  }
}

const handleListen = () => {
  if (currentWord.value) speak(currentWord.value)
}

// keyboard support
const handleKeyPress = (event: KeyboardEvent) => {
  if (!gameStarted.value) return
  const key = event.key.toLowerCase()
  if (key === 'enter') {
    event.preventDefault()
    if (isCorrect.value === false) { resetRound(); return }
    if (isCorrect.value === true) { nextRound(); return }
    if (isCorrect.value === null) { if (selectedLetters.value.length > 0) checkWord(); return }
  }
  if (isCorrect.value !== null) return
  const availableTile = letterQueue.value.find(tile => !tile.selected && tile.letter.toLowerCase() === key)
  if (availableTile) selectLetter(availableTile)
}

onMounted(() => window.addEventListener('keydown', handleKeyPress))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress))

// expose to template
const selectedVoiceRef = selectedVoice

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
.selected-tile { background: #2196F3; color: white; border: 2px solid #1976D2; }
.empty-tile { background: #f5f5f5; color: #9e9e9e; border: 2px dashed #bdbdbd; }
.empty-tile.next-position { background: #E3F2FD; border: 2px dashed #2196F3; border-width: 3px; }
.correct-tile { background: #4CAF50 !important; border-color: #388E3C !important; }
.incorrect-tile { background: #f44336 !important; border-color: #d32f2f !important; }
.letter-queue { display:flex; justify-content:center; gap:12px; flex-wrap:wrap }
.letter-queue-btn { min-width:60px !important; min-height:60px !important; font-size:24px !important; font-weight:bold }
.difficulty-card { cursor:pointer; transition: all .3s ease; height:100%; }
.difficulty-card:hover { transform: translateY(-8px); }
</style>
