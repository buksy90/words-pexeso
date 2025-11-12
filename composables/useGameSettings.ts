import type { Ref } from 'vue';
import { onMounted, watch } from 'vue';
import { useLocalStorage } from './useLocalStorage';

export interface GameSettings {
  fontFamily: string;
  fontSize: number;
}

export function useGameSettings(): Ref<GameSettings> {
  const settings: Ref<GameSettings> = useState<GameSettings>('gameSettings', () => ({
    fontFamily: FONT_OPTIONS[0]!.value,
    fontSize: 20 // Default to Medium
  }));

  const localStorage = useLocalStorage<GameSettings>('pexeso_game_settings');
  if (typeof window !== 'undefined') {
    onMounted(() => {
      const state = localStorage.load();
      if (state) {
          if (state && typeof state === 'object') {
            if (state.fontFamily) settings.value.fontFamily = state.fontFamily;
            if (typeof state.fontSize === 'number') settings.value.fontSize = state.fontSize;
          }
        }
    });

    watch(settings, () => {
      localStorage.save(settings.value);
    }, { deep: true });
  }

  return settings;
}
