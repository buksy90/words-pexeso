import { ref, computed, type Ref } from 'vue'
import { shuffleArray, voidWarning } from './helpers'

export interface LetterTile {
  letter: string
  id: number
  selected: boolean
}

export const useLettersQueue2 = (
  word: string,
  letters?: string[],
) => {
  const selectedLetters = ref<(LetterTile | null)[]>(Array(word.length).fill(null))
  const activePosition = ref(0);
  const letterQueue = ref<LetterTile[]>(
    letters
      ? letters.map((l, i) => ({ letter: l, id: i, selected: false }))
      : shuffleArray(word.split('').map((l, i) => ({ letter: l, id: i, selected: false })))
  );
  const availableLetters = computed(() => letterQueue.value.filter(t => !t.selected))

  const selectLetter = (tile: LetterTile) => {
    if (tile.selected) return voidWarning('Tile already selected');
    if (activePosition.value >= word.length) return voidWarning('No active position available');

    tile.selected = true
    selectedLetters.value[activePosition.value] = tile

    moveToNextEmptyPosition();
  }

  function moveToNextEmptyPosition() {
    for (let i = activePosition.value + 1; i < word.length; i++) {
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

  const removeSelected = (index: number) => {
    if (index < 0 || index >= selectedLetters.value.length) return voidWarning('Cannot remove tile: Index out of bounds');

    const tile = selectedLetters.value[index]
    if (tile) {
      tile.selected = false
      selectedLetters.value[index] = null
      activePosition.value = index
    }
  }

  const setActivePosition = (position: number) => {
    if (position < 0 || position >= word.length) return voidWarning('Cannot set active position: Index out of bounds');
    activePosition.value = position
  }

  const resetSelections = () => {
    for(const tile of selectedLetters.value) {
      if (tile) tile.selected = false
    }

    selectedLetters.value = Array(word.length).fill(null)
    activePosition.value = 0
  }

  return {
    letterQueue: readonly(letterQueue),
    availableLetters: readonly(availableLetters),
    activePosition: readonly(activePosition),
    selectedLetters: readonly(selectedLetters),
    selectLetter,
    removeSelected,
    setActivePosition,
    resetSelections,
  }
}

export default useLettersQueue
