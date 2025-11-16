/**
 * Composable for the spell game logic.
 *
 * Players see an image and must select letters in correct order to spell the word.
 */

import { ref, computed } from 'vue'
import { useThings, type Thing, type Difficulty } from './useThings'
import { useCharacters } from './useCharacters'
import { useLettersQueue } from './useLettersQueue'
import { shuffleArray } from './helpers'

export const useSpellGame = (charactersComposable = useCharacters()) => {
  // Game state
  const currentThing = ref<Thing | null>(null)
  const selectedLetters = ref<(LetterTile | null)[]>([])
  const isCorrect = ref<boolean | null>(null)
  const attempts = ref(0)
  const score = ref(0)
  const gameStarted = ref(false)
  const activePosition = ref(0)
  const difficulty = ref<Difficulty>('easy')
  const currentRoundAttempts = ref(0)
  const potentialPoints = ref(0)
  const completedWords = ref<Set<string>>(new Set())
  const totalWords = ref(0)

  // Computed properties
  const targetWord = computed(() => currentThing.value?.word || '')
  const currentWord = computed(() =>
    selectedLetters.value.map(tile => tile?.letter || '').join('')
  )
  const isComplete = computed(() =>
    selectedLetters.value.filter(t => t !== null).length === targetWord.value.length
  )
  // letter queue and selection helpers are extracted to composable
  const {
    letterQueue,
    setQueue,
    availableLetters,
    selectLetter,
    removeSelectedLetter,
    setActivePosition,
    resetSelections,
  } = useLettersQueue(selectedLetters, activePosition, isCorrect)

  /**
   * Get incorrect letters to add based on difficulty
   */
  const getIncorrectLetters = (wordLetters: string[]): string[] => {
    const { active } = charactersComposable;
    const incorrectCount = difficulty.value === 'medium' ? 2 : difficulty.value === 'hard' ? 5 : 0

    if (incorrectCount === 0) return []

    // Get available characters that are not in the current word
    const wordLetterSet = new Set(wordLetters.map(l => l.toLowerCase()))
    const availableChars = active.value.filter(char => !wordLetterSet.has(char.toLowerCase()))

    // Shuffle and take the required number
    const shuffled = shuffleArray(availableChars)
    return shuffled.slice(0, Math.min(incorrectCount, shuffled.length))
  }

  /**
   * Initialize a new round with a random thing
   */
  const initRound = () => {
    const { getThingsByDifficulty } = useThings()
    const availableThings = getThingsByDifficulty(difficulty.value)

    // Filter out already completed words
    const remainingThings = availableThings.filter(
      thing => !completedWords.value.has(thing.word)
    )

    // If all words completed, start over
    const thingsToChooseFrom = remainingThings.length > 0 ? remainingThings : availableThings

    if (thingsToChooseFrom.length === 0) {
      console.error(`No things available for difficulty: ${difficulty.value}`)
      return
    }

    // Pick a random thing from available options
    const randomIndex = Math.floor(Math.random() * thingsToChooseFrom.length)
    const thing = thingsToChooseFrom[randomIndex]

    if (!thing) {
      console.error(`Failed to select a thing`)
      return
    }

    currentThing.value = thing
    selectedLetters.value = Array(thing.word.length).fill(null)
    isCorrect.value = null
    activePosition.value = 0
    currentRoundAttempts.value = 0

    // Calculate potential points based on word length and difficulty bonus
    const difficultyBonus = difficulty.value === 'medium' ? 1 : difficulty.value === 'hard' ? 2 : 0
    potentialPoints.value = thing.word.length + difficultyBonus

    // Create letter tiles from the word
    const wordLetters = thing.word.split('')
    const letters = wordLetters.map((letter, index) => ({
      letter,
      id: index,
      selected: false,
    }))

    // Add incorrect letters based on difficulty
    const incorrectLetters = getIncorrectLetters(wordLetters)
    const incorrectTiles = incorrectLetters.map((letter, index) => ({
      letter,
      id: thing.word.length + index,
      selected: false,
    }))

    // Combine and shuffle all letters via letters queue composable
    setQueue([...letters, ...incorrectTiles])
    gameStarted.value = true
  }

  /**
   * Start a new game
   */
  const startGame = (selectedDifficulty: Difficulty = 'easy') => {
    difficulty.value = selectedDifficulty
    attempts.value = 0
    score.value = 0
    completedWords.value = new Set()
    const { getThingsCountByDifficulty } = useThings()
    totalWords.value = getThingsCountByDifficulty(selectedDifficulty)
    initRound()
  }

  /**
   * Select a letter from the queue
   */
  // letter selection logic moved to `useLettersQueue`

  /**
   * Remove the last selected letter
   */
  // undo logic moved to `useLettersQueue`

  /**
   * Remove a specific selected letter by clicking on it
   */
  // removeSelectedLetter moved to `useLettersQueue`

  /**
   * Set the active position where next letter will be placed
   */
  // setActivePosition moved to `useLettersQueue`

  /**
   * Check if the spelled word is correct
   */
  const checkWord = () => {
    if (selectedLetters.value.length === 0) return

    attempts.value++
    currentRoundAttempts.value++
    const correct = currentWord.value === targetWord.value
    isCorrect.value = correct

    if (correct) {
      // Award points: 1 per letter, minus penalty for failed attempts
      const pointsEarned = Math.max(1, potentialPoints.value)
      score.value += pointsEarned
      // Track completed word
      if (currentThing.value) {
        completedWords.value.add(currentThing.value.word)
      }
    } else {
      // Decrease potential points for next attempt, but keep minimum of 1
      potentialPoints.value = Math.max(1, potentialPoints.value - 1)
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
    // Clear selections using letters queue composable and reset state
    const wordLength = targetWord.value.length
    resetSelections(wordLength)
    isCorrect.value = null
    // Keep potentialPoints as it decreases with each failed attempt
  }

  /**
   * Decrement potential points (called when player uses hints like listening)
   */
  const decrementPotentialPoints = () => {
    potentialPoints.value = Math.max(1, potentialPoints.value - 1)
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
    difficulty: computed(() => difficulty.value),
    potentialPoints: computed(() => potentialPoints.value),
    completedWordsCount: computed(() => completedWords.value.size),
    totalWords: computed(() => totalWords.value),
    progressPercentage: computed(() =>
      totalWords.value > 0 ? Math.round((completedWords.value.size / totalWords.value) * 100) : 0
    ),

    // Computed
    targetWord,
    currentWord,
    isComplete,
    availableLetters,

    // Actions
    startGame,
    initRound,
    selectLetter,
    removeSelectedLetter,
    setActivePosition,
    checkWord,
    nextRound,
    resetRound,
    decrementPotentialPoints,
  }
}
