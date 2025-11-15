import { describe, it, expect, vi, beforeEach } from 'vitest';

let mockLoad: ReturnType<typeof vi.fn>;
let mockSave: ReturnType<typeof vi.fn>;

describe('useGameSettings', () => {
  beforeEach(async () => {
    mockLoad = vi.fn();
    mockSave = vi.fn();

    vi.resetModules();

    vi.mock('~/composables/useLocalStorage', () => ({
      useLocalStorage: () => ({ load: mockLoad, save: mockSave })
    }));

    vi.mock('vue', async () => {
      const actual = await vi.importActual<typeof import('vue')>('vue');
      return {
        ...actual,
        onMounted: (fn: Function) => fn()
      };
    });

    const vue = await import('vue');
    // Provide minimal FONT_OPTIONS and FONT_SIZE_OPTIONS globals used by the composable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).FONT_OPTIONS = [{ name: 'Default', value: 'Arial', preview: 'A' }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).FONT_SIZE_OPTIONS = [{ name: 'Medium', value: 20 }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).useState = (key: string, initializer?: any) => {
      const init = typeof initializer === 'function' ? initializer() : (initializer ?? {});
      return vue.ref(init);
    };
  });

  it('loads settings from localStorage on mount', async () => {
    mockLoad.mockReturnValue({ fontFamily: 'TestFont', fontSize: 12 });

    const { useGameSettings } = await import('~/composables/useGameSettings');
    const settings = useGameSettings();

    expect(settings.value.fontFamily).toBe('TestFont');
    expect(settings.value.fontSize).toBe(12);
  });

  it('saves settings to localStorage when changed', async () => {
    mockLoad.mockReturnValue(null);
    const { useGameSettings } = await import('~/composables/useGameSettings');
    const vue = await import('vue');

    const settings = useGameSettings();
    settings.value.fontSize = 15;
    await vue.nextTick();

    expect(mockSave).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith(settings.value);
  });

  it('partially applies loaded state (only valid fields)', async () => {
    mockLoad.mockReturnValue({ fontFamily: 'LoadedOnly' });
    const { useGameSettings } = await import('~/composables/useGameSettings');
    const settings = useGameSettings();

    expect(settings.value.fontFamily).toBe('LoadedOnly');
    expect(typeof settings.value.fontSize).toBe('number');
  });
});
