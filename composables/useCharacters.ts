import type { Ref } from 'vue';
import { onMounted, watch } from 'vue';

// Composable to manage active characters selection for the game setup
export function useCharacters() {
  // Global reactive state (Nuxt 3 useState keeps value across pages)
  const active: Ref<string[]> = useState<string[]>('activeChars', () => []);

  // Persistence key
  const STORAGE_KEY = 'pexeso_active_chars';

  // Load from localStorage on client mount
  onMounted(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          active.value = arr.filter(c => typeof c === 'string');
        }
      }
    } catch (e) {
      // silent fail
    }
  });

  // Persist whenever it changes
  watch(active, (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch (e) {
      // ignore quota errors
    }
  }, { deep: true });

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
