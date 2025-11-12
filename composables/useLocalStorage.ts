export function useLocalStorage<T>(key: string) {

  function load(): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed as T;
        }
      }
    } catch (e) {
      // ignore malformed data
    }

    return null;
  }

  function save(value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // quota errors ignored
    }
  }

  return { load, save };
}
