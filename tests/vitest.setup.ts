import { ref } from 'vue'

// Polyfill Nuxt's `useState` runtime helper for tests.
// Tests often import composables that call `useState`; in the real app
// Nuxt provides it, but in Vitest we need a small shim.
(globalThis as any).useState = (key: string, initializer?: () => any) => {
  const initial = typeof initializer === 'function' ? initializer() : undefined
  return ref(initial)
}

// Optionally expose other Nuxt runtime helpers here if tests need them.
