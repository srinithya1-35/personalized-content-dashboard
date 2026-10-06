import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/services/types';
import { storageService } from '@/services/storageService';

const FAVORITES_STORAGE_KEY = 'aura_favorites';

interface FavoritesState {
  items: ContentItem[];
  activeFilter: 'all' | 'news' | 'movie' | 'music' | 'social';
}

const initialState: FavoritesState = {
  items: storageService.getItem<ContentItem[]>(FAVORITES_STORAGE_KEY, []),
  activeFilter: 'all',
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const index = state.items.findIndex((fav) => fav.id === item.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift({ ...item, isFavorite: true });
      }
      storageService.setItem(FAVORITES_STORAGE_KEY, state.items);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      storageService.setItem(FAVORITES_STORAGE_KEY, state.items);
    },
    clearAllFavorites: (state) => {
      state.items = [];
      storageService.setItem(FAVORITES_STORAGE_KEY, []);
    },
    setActiveFilter: (
      state,
      action: PayloadAction<'all' | 'news' | 'movie' | 'music' | 'social'>
    ) => {
      state.activeFilter = action.payload;
    },
  },
});

export const {
  toggleFavorite,
  removeFavorite,
  clearAllFavorites,
  setActiveFilter,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
