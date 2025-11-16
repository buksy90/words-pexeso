import { ref, computed, type Ref } from 'vue'
import { shuffleArray } from './helpers'

export interface LetterTile {
  letter: string
  id: number
  selected: boolean
}



export const useLettersQueue = (
  selectedLetters: Ref<(LetterTile | null)[]>,
  isCorrect: Ref<boolean | null>
) => {
  const activePosition = ref(0);
  const letterQueue = ref<LetterTile[]>([])
  const availableLetters = computed(() => letterQueue.value.filter(t => !t.selected))

  const setQueue = (tiles: LetterTile[]) => {
    letterQueue.value = shuffleArray([...tiles])
  }

  const selectLetter = (tile: LetterTile) => {
    if (tile.selected || isCorrect.value !== null) return
    if (activePosition.value >= selectedLetters.value.length) return

    tile.selected = true
    selectedLetters.value[activePosition.value] = tile

    moveToNextEmptyPosition();
  }

  function moveToNextEmptyPosition() {
    for (let i = activePosition.value + 1; i < selectedLetters.value.length; i++) {
      if (selectedLetters.value[i] === null) {
        activePosition.value = i
        return
      }
    }
    for (let i = 0; i < activePosition.value; i++) {
      if (selectedLetters.value[i] === null) {
        activePosition.value = i
        return
      }
    }
  }

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

  const setActivePosition = (position: number) => {
    if (isCorrect.value !== null) return
    if (position >= 0 && position < selectedLetters.value.length) {
      activePosition.value = position
    }
  }

  const resetSelections = (wordLength: number) => {
    // Clear selected flags on tiles referenced in selectedLetters
    selectedLetters.value.forEach(tile => {
      if (tile) tile.selected = false
    })

    selectedLetters.value = Array(wordLength).fill(null)
    activePosition.value = 0
  }

  return {
    letterQueue,
    setQueue,
    availableLetters,
    selectLetter,
    removeSelectedLetter,
    setActivePosition,
    getActivePosition: () => activePosition.value,
    resetSelections,
  }
}

export default useLettersQueue
