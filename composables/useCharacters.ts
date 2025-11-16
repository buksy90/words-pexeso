import type { Ref } from 'vue';
import { onMounted, watch } from 'vue';
import { useLocalStorage } from './useLocalStorage';

// Composable to manage active characters selection for the game setup
export function useCharacters(startupChars: string[] = []) {
  // Global reactive state (Nuxt 3 useState keeps value across pages)
  const active: Ref<string[]> = useState<string[]>('activeChars', () => startupChars);

  // Persistence key
  const STORAGE_KEY = 'pexeso_active_chars';

  // Use the shared useLocalStorage composable for persistence
  const storage = useLocalStorage<string[]>(STORAGE_KEY);

  // Load from storage on client mount
  if (typeof window !== 'undefined') {
    onMounted(() => {
      try {
        const state = storage.load();
        if (state && Array.isArray(state)) {
          active.value = state.filter(c => typeof c === 'string');
        }
      } catch (e) {
        // silent fail
      }
    });

    // Persist whenever it changes
    watch(active, (val) => {
      try {
        storage.save(val);
      } catch (e) {
        // ignore quota errors
      }
    }, { deep: true });
  }

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
