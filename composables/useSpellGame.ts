/**
 * Composable for the spell game logic.
 *
 * Players see an image and must select letters in correct order to spell the word.
 */

import { ref, computed, watch } from 'vue'
import { useThings, type Thing } from './useThings'

export interface LetterTile {
  letter: string
  id: number
  selected: boolean
}

export const useSpellGame = () => {
  const { getRandomThing } = useThings()

  // Game state
  const currentThing = ref<Thing | null>(null)
  const letterQueue = ref<LetterTile[]>([])
  const selectedLetters = ref<LetterTile[]>([])
  const isCorrect = ref<boolean | null>(null)
  const attempts = ref(0)
  const score = ref(0)
  const gameStarted = ref(false)

  // Computed properties
  const targetWord = computed(() => currentThing.value?.word || '')
  const currentWord = computed(() =>
    selectedLetters.value.map(tile => tile.letter).join('')
  )
  const isComplete = computed(() =>
    selectedLetters.value.length === targetWord.value.length
  )
  const availableLetters = computed(() =>
    letterQueue.value.filter(tile => !tile.selected)
  )

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Initialize a new round with a random thing
   */
  const initRound = () => {
    const thing = getRandomThing()
    if (!thing) {
      console.error('No things available for spell game')
      return
    }

    currentThing.value = thing
    selectedLetters.value = []
    isCorrect.value = null

    // Create letter tiles from the word
    const letters = thing.word.split('').map((letter, index) => ({
      letter,
      id: index,
      selected: false,
    }))

    // Shuffle the letters to create the queue
    letterQueue.value = shuffleArray(letters)
    gameStarted.value = true
  }

  /**
   * Start a new game
   */
  const startGame = () => {
    attempts.value = 0
    score.value = 0
    initRound()
  }

  /**
   * Select a letter from the queue
   */
  const selectLetter = (tile: LetterTile) => {
    if (tile.selected || isCorrect.value !== null) return

    // Mark as selected
    tile.selected = true
    selectedLetters.value.push(tile)
  }

  /**
   * Remove the last selected letter
   */
  const undoLastLetter = () => {
    if (selectedLetters.value.length === 0 || isCorrect.value !== null) return

    const lastTile = selectedLetters.value.pop()
    if (lastTile) {
      lastTile.selected = false
    }
  }

  /**
   * Remove a specific selected letter by clicking on it
   */
  const removeSelectedLetter = (tile: LetterTile) => {
    if (isCorrect.value !== null) return

    const index = selectedLetters.value.findIndex(t => t.id === tile.id)
    if (index !== -1) {
      selectedLetters.value.splice(index, 1)
      tile.selected = false
    }
  }

  /**
   * Check if the spelled word is correct
   */
  const checkWord = () => {
    if (selectedLetters.value.length === 0) return

    attempts.value++
    const correct = currentWord.value === targetWord.value
    isCorrect.value = correct

    if (correct) {
      score.value++
    }
  }

  /**
   * Move to next round
   */
  const nextRound = () => {
    if (isCorrect.value === null) return
    initRound()
  }

  /**
   * Reset the current round
   */
  const resetRound = () => {
    selectedLetters.value.forEach(tile => {
      tile.selected = false
    })
    selectedLetters.value = []
    isCorrect.value = null
  }

  return {
    // State
    currentThing: computed(() => currentThing.value),
    letterQueue: computed(() => letterQueue.value),
    selectedLetters: computed(() => selectedLetters.value),
    isCorrect: computed(() => isCorrect.value),
    attempts: computed(() => attempts.value),
    score: computed(() => score.value),
    gameStarted: computed(() => gameStarted.value),

    // Computed
    targetWord,
    currentWord,
    isComplete,
    availableLetters,

    // Actions
    startGame,
    initRound,
    selectLetter,
    undoLastLetter,
    removeSelectedLetter,
    checkWord,
    nextRound,
    resetRound,
  }
}
