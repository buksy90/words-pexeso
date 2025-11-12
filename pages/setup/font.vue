<template>
  <v-container class="py-8">
    <SetupBreadcrumb />
    <h1 class="text-h4 mb-4">Select Font</h1>
    <p class="mb-6">Choose a font style that is easy to read for your child.</p>

    <v-row>
      <v-col
        v-for="font in FONT_OPTIONS"
        :key="font.value"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          :variant="settings.fontFamily === font.value ? 'elevated' : 'outlined'"
          :color="settings.fontFamily === font.value ? 'primary' : undefined"
          class="font-card"
          @click="selectFont(font.value)"
          :elevation="settings.fontFamily === font.value ? 8 : 2"
        >
          <v-card-text class="text-center pa-6">
            <div class="font-name mb-3">{{ font.name }}</div>
            <div
              class="font-preview"
              :style="{ fontFamily: font.value }"
            >
              {{ font.preview }}
            </div>
            <div
              class="sample-text mt-3"
              :style="{ fontFamily: font.value }"
            >
              mama tata
            </div>
            <v-icon
              v-if="settings.fontFamily === font.value"
              color="white"
              class="selected-icon"
              size="32"
            >
              mdi-check-circle
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          :to="'/setup'"
        >
          Back to Setup
        </v-btn>
        <v-btn
          color="primary"
          append-icon="mdi-arrow-right"
          :to="'/setup/characters'"
        >
          Continue to Characters
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useGameSettings } from '~/composables/useGameSettings';
import SetupBreadcrumb from '~/components/SetupBreadcrumb.vue';
import { FONT_OPTIONS } from '~/composables/constants';

const settings = useGameSettings();


const selectFont = (fontValue: string) => {
  settings.value.fontFamily = fontValue;
};
</script>

<style scoped>
.font-card {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 200px;
}

.font-card:hover {
  transform: translateY(-4px);
}

.font-name {
  font-size: 1rem;
  font-weight: 500;
}

.font-preview {
  font-size: 4rem;
  font-weight: bold;
  line-height: 1;
}

.sample-text {
  font-size: 1.5rem;
  color: #666;
}

.selected-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
