<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 mb-4">Welcome to Learning Games!</h1>
        <p class="text-h6 text-grey mb-8">
          Choose a game to help children learn letters and words
        </p>
      </v-col>
    </v-row>

    <!-- Available Games -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card
          class="game-card"
          hover
          elevation="4"
          @click="$router.push('/setup')"
        >
          <v-card-title class="text-h4 pa-6">
            <v-icon size="large" class="mr-2">mdi-cards</v-icon>
            Pexeso Memory Game
          </v-card-title>
          <v-card-text class="pa-6">
            <p class="text-h6 mb-4">
              A classic memory card game that helps children learn letter order awareness.
            </p>
            <ul class="text-body-1">
              <li>Match pairs of cards with the same word</li>
              <li>Develop memory and concentration skills</li>
              <li>Learn to distinguish between similar letter combinations</li>
              <li>Customize words and characters for your child's level</li>
            </ul>
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-play"
              block
              :to="'/setup'"
            >
              Start Pexeso Setup
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card
          class="game-card"
          hover
          elevation="4"
          @click="$router.push('/spell-game')"
        >
          <v-card-title class="text-h4 pa-6">
            <v-icon size="large" class="mr-2">mdi-image-text</v-icon>
            Spell the Word Game
          </v-card-title>
          <v-card-text class="pa-6">
            <p class="text-h6 mb-4">
              A puzzle game where children spell words by selecting letters in the correct order.
            </p>
            <ul class="text-body-1">
              <li>See an image and spell the corresponding word</li>
              <li>Practice letter recognition and sequencing</li>
              <li>Build vocabulary with familiar objects and animals</li>
              <li>Get instant feedback on your spelling</li>
            </ul>
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-play"
              block
              :to="'/spell-game'"
            >
              Play Spell Game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card
          class="game-card"
          hover
          elevation="4"
          @click="$router.push('/listen-game')"
        >
          <v-card-title class="text-h4 pa-6">
            <v-icon size="large" class="mr-2">mdi-headphones</v-icon>
            Listening Game
          </v-card-title>
          <v-card-text class="pa-6">
            <p class="text-h6 mb-4">
              Listen to a spoken word and spell it by selecting letters in the correct order.
            </p>
            <ul class="text-body-1">
              <li>Practice auditory word recognition</li>
              <li>Select letters in sequence to form the word</li>
              <li>Progress bar tracks success (max 10)</li>
            </ul>
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-play"
              block
              :to="'/listen-game'"
            >
              Play Listening Game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tech Stack Info -->
    <v-row class="mt-12">
      <v-col cols="12" class="text-center">
        <h2 class="text-h5 mb-6 text-grey-darken-1">Built With</h2>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title>TypeScript</v-card-title>
          <v-card-text>
            Fully typed development experience with TypeScript support
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title>Vuetify</v-card-title>
          <v-card-text>
            Beautiful Material Design components ready to use
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title>Nuxt 3</v-card-title>
          <v-card-text>
            Powerful Vue framework with server-side rendering
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Landing page showing available games
</script>

<style scoped>
.game-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.game-card:hover {
  transform: translateY(-8px);
}
</style>
