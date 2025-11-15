<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>
        Learning Games
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="text" prepend-icon="mdi-home">Home</v-btn>
      <v-btn to="/game" variant="text" prepend-icon="mdi-cards">Pexeso</v-btn>
      <v-btn to="/spell-game" variant="text" prepend-icon="mdi-image-text">Spell Game</v-btn>
      <v-btn to="/setup" variant="text" prepend-icon="mdi-cog">Setup</v-btn>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// TypeScript is enabled by default in Nuxt 3
</script>
