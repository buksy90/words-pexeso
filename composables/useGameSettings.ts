import type { Ref } from 'vue';
import { onMounted, watch } from 'vue';

export interface GameSettings {
  fontFamily: string;
}

export interface FontOption {
  name: string;
  value: string;
  preview: string;
}

// Available font options
export const FONT_OPTIONS: FontOption[] = [
  {
    name: 'Default',
    value: 'Roboto, sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Ms Madi (Handwritten)',
    value: '"Ms Madi", cursive',
    preview: 'Abc'
  },
  {
    name: 'Comic Sans (Playful)',
    value: '"Comic Sans MS", "Comic Sans", cursive',
    preview: 'Abc'
  },
  {
    name: 'Arial (Simple)',
    value: 'Arial, sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Georgia (Serif)',
    value: 'Georgia, serif',
    preview: 'Abc'
  },
  {
    name: 'Courier New (Monospace)',
    value: '"Courier New", Courier, monospace',
    preview: 'Abc'
  },
  {
    name: 'Verdana (Clear)',
    value: 'Verdana, sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Trebuchet MS (Friendly)',
    value: '"Trebuchet MS", sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Times New Roman (Classic)',
    value: '"Times New Roman", Times, serif',
    preview: 'Abc'
  }
];

export function useGameSettings() {
  const STORAGE_KEY = 'pexeso_game_settings';

  // Persistent state
  const settings: Ref<GameSettings> = useState<GameSettings>('gameSettings', () => ({
    fontFamily: FONT_OPTIONS[0]!.value
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

  return { settings, FONT_OPTIONS };
}
