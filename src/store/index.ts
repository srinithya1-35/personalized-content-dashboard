import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './slices/preferencesSlice';
import themeReducer from './slices/themeSlice';
import favoritesReducer from './slices/favoritesSlice';
import feedOrderReducer from './slices/feedOrderSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';
import contentReducer from './slices/contentSlice';

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    theme: themeReducer,
    favorites: favoritesReducer,
    feedOrder: feedOrderReducer,
    user: userReducer,
    search: searchReducer,
    content: contentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
