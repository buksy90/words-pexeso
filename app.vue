<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Pexeso Game</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/setup" variant="text" prepend-icon="mdi-cog">Setup</v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// TypeScript is enabled by default in Nuxt 3
</script>
