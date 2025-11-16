import { describe, it, expect } from 'vitest'
import { useSpellGame } from '../composables/useSpellGame'
import { useCharacters } from '../composables/useCharacters'

const characters = useCharacters(['a','b','c','d','e','f','g','h','i','j']);

describe('useSpellGame composable', () => {
  it('startGame initializes and initRound sets currentThing and selectedLetters length', () => {
    const game = useSpellGame(characters)
    game.startGame('easy')

    expect(game.totalWords.value).toBeGreaterThan(0)
    expect(game.currentThing.value).not.toBeNull()
    expect(game.selectedLetters.value.length).toBe(game.currentThing.value!.word.length)
  })

  it('checkWord recognizes correct spelling and awards points', () => {
    const game = useSpellGame(characters)
    game.startGame('easy')

    const thing = game.currentThing.value!
    const word = thing.word

    // select letters in correct order by picking matching available tiles
    for (const ch of word.split('')) {
      const tile = game.availableLetters.value.find(t => t.letter === ch)
      expect(tile).toBeDefined()
      game.selectLetter(tile!)
    }

    expect(game.currentWord.value).toBe(word)

    const initialScore = game.score.value
    const initialPotential = game.potentialPoints.value

    game.checkWord()

    expect(game.isCorrect.value).toBe(true)
    expect(game.completedWordsCount.value).toBe(1)
    // Points awarded should be at least 1 and equal to potential points on first try
    expect(game.score.value).toBe(initialScore + Math.max(1, initialPotential))
  })

  it('incorrect check reduces potentialPoints and does not mark completed', () => {
    const game = useSpellGame(characters)
    game.startGame('easy')

    const word = game.currentThing.value!.word

    // select letters in wrong order (reverse)
    const reversed = word.split('').reverse().join('')
    for (const ch of reversed.split('')) {
      const tile = game.availableLetters.value.find(t => t.letter === ch)
      expect(tile).toBeDefined()
      game.selectLetter(tile!)
    }

    const beforePotential = game.potentialPoints.value
    game.checkWord()

    expect(game.isCorrect.value).toBe(false)
    expect(game.completedWordsCount.value).toBe(0)
    expect(game.potentialPoints.value).toBe(Math.max(1, beforePotential - 1))
  })

  it('resetRound clears selected letters', () => {
    const game = useSpellGame(characters)
    game.startGame('easy')

    const word = game.currentThing.value!.word
    // pick one letter
    const tile = game.availableLetters.value.find(t => t.letter === word[0])
    expect(tile).toBeDefined()
    game.selectLetter(tile!)

    // ensure at least one selection
    expect(game.selectedLetters.value.some(s => s !== null)).toBe(true)

    game.resetRound()

    expect(game.selectedLetters.value.every(s => s === null)).toBe(true)
  })

  it('decrementPotentialPoints never goes below 1', () => {
    const game = useSpellGame(characters)
    game.startGame('easy')

    // fast-decrement many times
    for (let i = 0; i < 10; i++) {
      game.decrementPotentialPoints()
    }

    expect(game.potentialPoints.value).toBeGreaterThanOrEqual(1)
  })
})
