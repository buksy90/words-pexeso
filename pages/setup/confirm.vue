<template>
  <v-container class="py-8">
    <SetupBreadcrumb />
    <h1 class="text-h4 mb-2">Confirm & Edit Words</h1>
    <p class="text-body-1 mb-6">Review the generated words. You can edit, remove or add words manually before confirming.</p>

    <v-alert v-if="!active.length" type="warning" variant="tonal" class="mb-6">
      No characters selected. Go back to select characters first.
    </v-alert>

    <v-alert v-else-if="!state.words.length" type="info" variant="tonal" class="mb-6">
      No words generated yet. Generate words first.
    </v-alert>

    <div v-else>
      <v-row class="mb-2">
        <v-col cols="12" md="8" class="d-flex align-center flex-wrap">
          <span class="mr-2">Active Characters:</span>
          <v-chip v-for="c in active" :key="c" size="x-small" class="ma-1" color="primary" variant="flat">{{ c }}</v-chip>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right">
          <v-chip v-if="hasInvalid()" color="error" variant="tonal" size="small">Contains Invalid Words</v-chip>
          <v-chip v-else color="success" variant="tonal" size="small">All Words Valid</v-chip>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-row>
        <v-col cols="12">
          <v-table density="comfortable" class="mb-4">
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Word</th>
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(w, i) in state.words" :key="i">
                <td>{{ i + 1 }}</td>
                <td style="width:220px;">
                  <v-text-field
                    v-model="editable[i]"
                    density="compact"
                    variant="outlined"
                    hide-details
                    @update:model-value="markDirty(i)"
                  />
                </td>
                <td>
                  <v-chip :color="validateWord(editable[i]) ? 'success' : 'error'" size="x-small" variant="flat">
                    {{ validateWord(editable[i]) ? 'Valid' : 'Invalid' }}
                  </v-chip>
                </td>
                <td>
                  <v-btn icon size="x-small" variant="text" @click="saveSingle(i)" :disabled="!validateWord(editable[i])">
                    <v-icon size="18">mdi-content-save</v-icon>
                  </v-btn>
                  <v-btn icon size="x-small" variant="text" @click="removeWord(i)">
                    <v-icon size="18" color="error">mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <v-row class="mb-4">
        <v-col cols="12" md="6" class="d-flex align-center">
          <v-text-field
            v-model="newWord"
            label="Add Word"
            density="compact"
            hide-details
            class="mr-2"
            @keyup.enter="addNew"
          />
          <v-btn color="secondary" prepend-icon="mdi-plus" @click="addNew" :disabled="!validateWord(newWord)">Add</v-btn>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right d-flex justify-end align-center">
          <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="'/setup/words'">Back</v-btn>
          <v-btn
            color="primary"
            class="ml-2"
            prepend-icon="mdi-check"
            @click="confirmAll"
            :disabled="hasInvalid() || !state.words.length"
          >Confirm Words</v-btn>
        </v-col>
      </v-row>

      <v-alert v-if="state.confirmedWords.length && !state.dirty" type="success" variant="tonal" class="mt-2">
        {{ state.confirmedWords.length }} words confirmed. Ready for game setup.
      </v-alert>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useCharacters } from '~/composables/useCharacters';
import { useWordSetup } from '~/composables/useWordSetup';
import SetupBreadcrumb from '~/components/SetupBreadcrumb.vue';

const { active } = useCharacters();
const { state, validateWord, updateWord, removeWord, addWord, confirmWords, hasInvalid } = useWordSetup();

// local editable buffer
// IMPORTANT: state is a ref, must use state.value when accessing inside script
const editable = reactive<string[]>([...(Array.isArray(state.value.words) ? state.value.words : [])]);
const newWord = ref<string>('');

watch(() => state.value.words, (val) => {
  // sync when underlying array changes
  if (val.length !== editable.length) {
    editable.splice(0, editable.length, ...val);
  } else {
    val.forEach((w, i) => editable[i] = w);
  }
}, { deep: true });

const markDirty = (i: number) => {
  // placeholder if we later track per-row dirtiness
};

const saveSingle = (i: number) => {
  const w = editable[i];
  if (validateWord(w)) {
    updateWord(i, w);
  }
};

const addNew = () => {
  if (!validateWord(newWord.value)) return;
  addWord(newWord.value);
  newWord.value = '';
};

const confirmAll = () => {
  // push any unsaved edits first
  editable.forEach((w, i) => {
    const val = w ?? '';
    if (validateWord(val)) updateWord(i, val);
  });
  confirmWords();
};
</script>
