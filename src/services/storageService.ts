/**
 * Safe client-side storage wrapper that prevents SSR crashes
 * and handles test runners / environments where localStorage may not be available.
 */
export const storageService = {
  getItem<T>(key: string, defaultValue: T): T {
    if (
      typeof window === 'undefined' ||
      typeof window.localStorage === 'undefined' ||
      typeof window.localStorage.getItem !== 'function'
    ) {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (
      typeof window === 'undefined' ||
      typeof window.localStorage === 'undefined' ||
      typeof window.localStorage.setItem !== 'function'
    ) {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota exceeded or storage error silently
    }
  },

  removeItem(key: string): void {
    if (
      typeof window === 'undefined' ||
      typeof window.localStorage === 'undefined' ||
      typeof window.localStorage.removeItem !== 'function'
    ) {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};
