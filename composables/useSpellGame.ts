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
  const selectedLetters = ref<(LetterTile | null)[]>([])
  const isCorrect = ref<boolean | null>(null)
  const attempts = ref(0)
  const score = ref(0)
  const gameStarted = ref(false)
  const activePosition = ref(0)

  // Computed properties
  const targetWord = computed(() => currentThing.value?.word || '')
  const currentWord = computed(() =>
    selectedLetters.value.map(tile => tile?.letter || '').join('')
  )
  const isComplete = computed(() =>
    selectedLetters.value.filter(t => t !== null).length === targetWord.value.length
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
      const temp = shuffled[i]!
      shuffled[i] = shuffled[j]!
      shuffled[j] = temp
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
    selectedLetters.value = Array(thing.word.length).fill(null)
    isCorrect.value = null
    activePosition.value = 0

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
    if (activePosition.value >= selectedLetters.value.length) return

    // Mark as selected and place at active position
    tile.selected = true
    selectedLetters.value[activePosition.value] = tile

    // Move to next empty position
    for (let i = activePosition.value + 1; i < selectedLetters.value.length; i++) {
      if (selectedLetters.value[i] === null) {
        activePosition.value = i
        return
      }
    }
    // If no empty position found after current, check from beginning
    for (let i = 0; i < activePosition.value; i++) {
      if (selectedLetters.value[i] === null) {
        activePosition.value = i
        return
      }
    }
  }

  /**
   * Remove the last selected letter
   */
  const undoLastLetter = () => {
    if (isCorrect.value !== null) return

    // Find last non-null letter
    for (let i = selectedLetters.value.length - 1; i >= 0; i--) {
      if (selectedLetters.value[i] !== null) {
        const tile = selectedLetters.value[i]
        if (tile) {
          tile.selected = false
          selectedLetters.value[i] = null
          activePosition.value = i
        }
        return
      }
    }
  }

  /**
   * Remove a specific selected letter by clicking on it
   */
  const removeSelectedLetter = (index: number) => {
    if (isCorrect.value !== null) return
    if (index < 0 || index >= selectedLetters.value.length) return

    const tile = selectedLetters.value[index]
    if (tile) {
      tile.selected = false
      selectedLetters.value[index] = null
      activePosition.value = index
    }
  }

  /**
   * Set the active position where next letter will be placed
   */
  const setActivePosition = (position: number) => {
    if (isCorrect.value !== null) return
    if (position >= 0 && position < selectedLetters.value.length) {
      activePosition.value = position
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
      if (tile) {
        tile.selected = false
      }
    })
    const wordLength = targetWord.value.length
    selectedLetters.value = Array(wordLength).fill(null)
    isCorrect.value = null
    activePosition.value = 0
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
    activePosition: computed(() => activePosition.value),

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
    setActivePosition,
    checkWord,
    nextRound,
    resetRound,
  }
}
