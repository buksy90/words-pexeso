<template>
  <v-container class="py-8">
    <SetupBreadcrumb />
    <h1 class="text-h4 mb-2">Generate Words</h1>
    <p class="text-body-1 mb-6">Choose word length range and how many unique words to generate from selected characters.</p>

    <v-alert
      v-if="!active.length"
      type="warning"
      variant="tonal"
      class="mb-6"
    >No characters selected. Go back and pick characters first.</v-alert>

    <v-row v-else>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="state.minLength"
          type="number"
          label="Min Length"
          :min="1"
          :max="state.maxLength"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="state.maxLength"
          type="number"
          label="Max Length"
          :min="state.minLength"
          :max="12"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="state.count"
          type="number"
          label="Words Count"
          :min="1"
          :max="50"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <v-row class="mt-2" v-if="active.length">
      <v-col cols="12" class="d-flex align-center flex-wrap">
        <span class="mr-2">Active Characters:</span>
        <v-chip v-for="c in active" :key="c" size="small" class="ma-1" color="primary" variant="flat">{{ c }}</v-chip>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <div class="d-flex mb-4">
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        :disabled="!active.length || state.generating"
        @click="generateWords"
        class="mr-2"
      >
        {{ state.generating ? 'Generating...' : 'Generate' }}
      </v-btn>
      <v-btn variant="text" prepend-icon="mdi-delete" @click="clearWords" :disabled="!state.words.length">Clear</v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="'/setup'">Back</v-btn>
      <v-btn
        color="secondary"
        class="ml-2"
        prepend-icon="mdi-arrow-right"
        :disabled="!state.words.length"
        :to="state.words.length ? '/setup/confirm' : undefined"
      >Next</v-btn>
    </div>

    <v-row>
      <v-col cols="12">
        <v-alert v-if="!state.words.length && !state.generating" type="info" variant="tonal" density="compact">No words generated yet.</v-alert>
        <v-chip-group v-else column>
          <v-chip
            v-for="w in state.words"
            :key="w"
            class="ma-1"
            color="secondary"
            variant="elevated"
            size="small"
          >{{ w }}</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useCharacters } from '~/composables/useCharacters';
import { useWordSetup } from '~/composables/useWordSetup';
import SetupBreadcrumb from '~/components/SetupBreadcrumb.vue';

const { active } = useCharacters();
const { state, generateWords, clearWords } = useWordSetup();
</script>
