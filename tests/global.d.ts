declare global {
  // Minimal typing for Nuxt 3 `useState` helper used in composables during tests
  function useState<T>(key: string, initializer?: () => T): import('vue').Ref<T>
}

export {}
