<template>
  <div
    class="card-flip"
    :class="{ 'is-flipped': card.isRevealed, 'is-matched': card.isMatched }"
    @click.stop="emit('flip', index)"
  >
    <div class="card-inner">
      <div class="card-front">
        <v-card
          variant="outlined"
          class="d-flex align-center justify-center"
          height="120"
        >
          <v-icon size="40" color="primary">mdi-help</v-icon>
        </v-card>
      </div>
      <div class="card-back">
        <v-card
          :color="card.isMatched ? 'success' : 'primary'"
          class="d-flex align-center justify-center"
          height="120"
        >
          <span
            class="card-word"
            :style="{ fontFamily: fontFamily, fontSize: `${fontSize}px` }"
          >{{ card.word }}</span>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  card: { word: string; isRevealed: boolean; isMatched: boolean },
  index: number,
  // Accept the full composable instance so the component can read reactive values
  settings: { settings: { value: { fontFamily: string; fontSize: number } } }
}>();
const { card, index, settings } = props;

// Read reactive values from the passed composable instance
const fontFamily = computed(() => settings?.settings?.value?.fontFamily ?? 'inherit');
const fontSize = computed(() => settings?.settings?.value?.fontSize ?? 20);
const emit = defineEmits<{ (e: 'flip', index: number): void }>();
</script>

<style>
/* Card-specific styles are global so parent page classes (like .game-won) can target them */
.card-flip {
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  height: 120px;
  position: relative;
}

.card-flip.is-flipped {
  transform: rotateY(180deg);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.game-won .card-flip {
  animation: celebrate 1s ease-in-out;
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.card-word {
  font-weight: bold;
  letter-spacing: 0.05em;
}
</style>
