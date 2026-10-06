import { describe, it, expect } from 'vitest';
import themeReducer, { toggleTheme, setTheme } from '@/store/slices/themeSlice';

describe('themeSlice', () => {
  it('should toggle theme mode', () => {
    const initialState = { isDark: false };
    const nextState = themeReducer(initialState, toggleTheme());
    expect(nextState.isDark).toBe(true);

    const toggledBack = themeReducer(nextState, toggleTheme());
    expect(toggledBack.isDark).toBe(false);
  });

  it('should set explicit theme mode', () => {
    const initialState = { isDark: false };
    const nextState = themeReducer(initialState, setTheme(true));
    expect(nextState.isDark).toBe(true);
  });
});
