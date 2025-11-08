<template>
  <div>
    <v-container class="py-8">
      <SetupBreadcrumb />
      <h1 class="text-h4 mb-4">Setup</h1>
      <p class="mb-6">Configure game inputs before starting. Follow steps below.</p>
      <v-row>
        <v-col cols="12" md="6" class="d-flex flex-column">
          <v-btn color="primary" prepend-icon="mdi-format-font" :to="'/setup/font'" class="mb-3">1. Select Font</v-btn>
          <v-btn color="primary" prepend-icon="mdi-alphabetical" :to="'/setup/characters'" class="mb-3">2. Select Characters</v-btn>
          <v-btn
            color="secondary"
            prepend-icon="mdi-form-select"
            :to="'/setup/words'"
            :disabled="!active.length"
          >3. Generate Words</v-btn>
          <small class="text-grey mt-2" v-if="!active.length">Select at least one character to proceed to word generation.</small>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useCharacters } from '~/composables/useCharacters';
import SetupBreadcrumb from '~/components/SetupBreadcrumb.vue';
const { active } = useCharacters();
</script>
