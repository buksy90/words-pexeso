<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 mb-4">Playground</h1>
      </v-col>
      <v-col>
        <LettersQueue
          word="example"
          :letters="['e', 'x', 'a', 'm', 'p', 'l', 'e']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>
