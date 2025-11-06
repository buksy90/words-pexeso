import type { Ref } from 'vue';

// Composable to manage active characters selection for the game setup
export function useCharacters() {
  // Global reactive state (Nuxt 3 useState keeps value across pages)
  const active: Ref<string[]> = useState<string[]>('activeChars', () => []);

  const toggle = (ch: string) => {
    const idx = active.value.indexOf(ch);
    if (idx >= 0) {
      active.value.splice(idx, 1);
    } else {
      active.value.push(ch);
    }
  };

  const isActive = (ch: string) => active.value.includes(ch);

  const clearAll = () => {
    active.value = [];
  };

  const selectAll = (chars: string[]) => {
    active.value = [...chars];
  };

  return { active, toggle, isActive, clearAll, selectAll };
}
