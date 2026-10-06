import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storageService';

const THEME_STORAGE_KEY = 'aura_theme_mode';

interface ThemeState {
  isDark: boolean;
}

const initialState: ThemeState = {
  isDark: storageService.getItem<boolean>(THEME_STORAGE_KEY, false),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      storageService.setItem(THEME_STORAGE_KEY, state.isDark);
      if (typeof document !== 'undefined') {
        if (state.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      storageService.setItem(THEME_STORAGE_KEY, state.isDark);
      if (typeof document !== 'undefined') {
        if (state.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
