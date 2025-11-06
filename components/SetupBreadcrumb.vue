<template>
  <nav aria-label="Setup breadcrumb" class="mb-4">
    <v-breadcrumbs :items="items" divider="/" class="pa-0">
      <template #item="{ item }">
        <v-breadcrumbs-item
          :disabled="item.disabled"
          :to="item.to"
          :class="[ item.to === currentPath ? 'text-primary font-weight-bold' : '', 'setup-breadcrumb-item']"
        >
          <v-icon v-if="item.icon" size="18" class="mr-1">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCharacters } from '~/composables/useCharacters';
import { useWordSetup } from '~/composables/useWordSetup';

const route = useRoute();
const { active } = useCharacters();
const { state } = useWordSetup();

// Determine active step
const currentPath = computed(() => route.path);

interface CrumbItem { title: string; to?: string; disabled: boolean; icon?: string }
const items = computed<CrumbItem[]>(() => {
  const hasChars = active.value.length > 0;
  const hasWords = state.value.words.length > 0;
  return [
    {
      title: 'Characters',
      to: '/setup/characters',
      disabled: false,
      icon: 'mdi-alphabetical'
    },
    {
      title: 'Words',
      to: hasChars ? '/setup/words' : undefined,
      disabled: !hasChars,
      icon: 'mdi-form-select'
    },
    {
      title: 'Confirm',
      to: hasWords ? '/setup/confirm' : undefined,
      disabled: !hasWords,
      icon: 'mdi-check-circle'
    }
  ];
});
</script>

<style scoped>
.setup-breadcrumb-item {
  text-transform: none;
  font-size: 0.85rem;
}
</style>
