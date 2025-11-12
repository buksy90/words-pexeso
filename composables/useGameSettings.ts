import type { Ref } from 'vue';
import { onMounted, watch } from 'vue';
import { FONT_SIZE_OPTIONS } from './constants';

export interface GameSettings {
  fontFamily: string;
  fontSize: number;
}

export interface FontOption {
  name: string;
  value: string;
  preview: string;
}

export interface FontSizeOption {
  name: string;
  value: number;
}

export function useGameSettings(): Ref<GameSettings> {
  const STORAGE_KEY = 'pexeso_game_settings';

  // Persistent state
  const settings: Ref<GameSettings> = useState<GameSettings>('gameSettings', () => ({
    fontFamily: FONT_OPTIONS[0]!.value,
    fontSize: 20 // Default to Medium
  }));

  // Load from localStorage on mount
  onMounted(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            if (parsed.fontFamily) settings.value.fontFamily = parsed.fontFamily;
            if (typeof parsed.fontSize === 'number') settings.value.fontSize = parsed.fontSize;
          }
        }
      } catch (e) {
        // ignore malformed data
      }
    }
  });

  // Save to localStorage when changed
  watch(settings, () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
      } catch (e) {
        // quota errors ignored
      }
    }
  }, { deep: true });

  return settings;
}
