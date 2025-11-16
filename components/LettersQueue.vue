<template>
  <div>
    <div class="text-center mb-6">
      <h3 class="text-h6 mb-3">Your Word:</h3>
      <div class="selected-letters-container">
        <div
          v-for="(tile, index) in selectedLetters"
          :key="`pos-${index}`"
          class="letter-tile cursor-pointer"
          :class="{
            'selected-tile': tile !== null,
            'empty-tile': tile === null,
            'active-tile': index === activePosition,
            'clickable': tile !== null,
          }"
          @click="handleTileClick(index)"
        >
          {{ tile?.letter ? tile.letter.toUpperCase() : '_' }}
        </div>
      </div>
    </div>

    <div class="text-center mb-4">
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useLettersQueue2 } from '@/composables/useLettersQueue2';

const props = defineProps<{
  word: string,
  letters?: string[],
}>();

const { letterQueue, selectLetter, selectedLetters, activePosition, removeSelected, setActivePosition
} = useLettersQueue2(props.word, props.letters)

const handleTileClick = (index: number) => {
  const tile = selectedLetters.value[index]
  if (tile !== null) {
    removeSelected(index)
  } else {
    setActivePosition(index)
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  switch(key) {
    case 'delete': removeSelected(activePosition.value); break;
    case 'backspace': removeSelected(activePosition.value - 1); break;
    case 'arrowleft': setActivePosition(activePosition.value - 1); break;
    case 'arrowright': setActivePosition(activePosition.value + 1); break;
    case 'home': setActivePosition(0); break;
    case 'end': setActivePosition(selectedLetters.value.length - 1); break;

    default: {
      const availableTile = letterQueue.value.find(tile => !tile.selected && tile.letter.toLowerCase() === key)

      if (!availableTile) {
        // No matching tile found,
        return
      }

      selectLetter(availableTile);
    }
  }

  // If a key was handled, prevent default browser action
  event.preventDefault();
}

onMounted(() => window.addEventListener('keydown', handleKeyPress))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress))

watch(selectedLetters, () => {
  if (selectedLetters.value.every(tile => tile !== null)) {
    emit('fullfilled', selectedLetters.value.map(tile => tile.letter).join(''));
  }
})

const emit = defineEmits<{ (e: 'fullfilled', word: string ): void }>();
</script>

<style>
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
.active-tile { background: #E3F2FD; border: 2px dashed #2196F3; border-width: 3px; }
.letter-queue { display:flex; justify-content:center; gap:12px; flex-wrap:wrap }
.letter-queue-btn { min-width:60px !important; min-height:60px !important; font-size:24px !important; font-weight:bold }
</style>
