<template>
  <v-container class="py-8">
    <h1 class="text-h4 mb-2">Select Characters</h1>
    <p class="text-body-1 mb-6">Toggle the characters that children already know. These will be used to generate words later.</p>

    <div v-for="(row, rIdx) in keyboardRows" :key="rIdx" class="d-flex justify-center mb-2">
      <v-btn
        v-for="ch in row"
        :key="ch"
        class="ma-1"
        :color="isActive(ch) ? 'primary' : 'grey-darken-2'"
        :variant="isActive(ch) ? 'elevated' : 'outlined'"
        size="small"
        @click="toggle(ch)"
      >{{ ch }}</v-btn>
    </div>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="6">
        <v-alert type="info" variant="tonal" density="compact" class="mb-4">
          Selected: <strong>{{ active.join(', ') || 'None' }}</strong>
        </v-alert>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right d-flex align-center justify-end">
        <v-btn class="mr-2" variant="text" @click="clearAll" prepend-icon="mdi-close-circle">Clear</v-btn>
        <v-btn variant="text" @click="selectAll(allChars)" prepend-icon="mdi-select-all">Select All</v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-btn color="primary" prepend-icon="mdi-arrow-right" :to="'/setup'">Back</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useCharacters } from '~/composables/useCharacters';

const { active, toggle, isActive, clearAll, selectAll } = useCharacters();

// Basic QWERTY layout. Adjust / extend for locale as needed.
const keyboardRows: string[][] = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

const allChars = keyboardRows.flat();
</script>

<style scoped>
/* Center buttons elegantly on wrap */
</style>
