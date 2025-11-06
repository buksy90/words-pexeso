<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Pexeso Game</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <h1 class="text-h3 mb-4">Welcome to Pexeso!</h1>
            <p class="text-h6 text-grey">
              A memory card game built with Nuxt 3, TypeScript, and Vuetify
            </p>
            
            <v-btn
              color="primary"
              size="large"
              class="mt-6"
              prepend-icon="mdi-play"
            >
              Start Game
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="mt-8">
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>TypeScript</v-card-title>
              <v-card-text>
                Fully typed development experience with TypeScript support
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Vuetify</v-card-title>
              <v-card-text>
                Beautiful Material Design components ready to use
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Nuxt 3</v-card-title>
              <v-card-text>
                Powerful Vue framework with server-side rendering
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// TypeScript is enabled by default in Nuxt 3
</script>
