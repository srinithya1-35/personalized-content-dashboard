import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/services/types';
import { storageService } from '@/services/storageService';

export const ALL_CATEGORIES: { id: Category; label: string; icon: string; description: string }[] = [
  { id: 'technology', label: 'Technology', icon: '💻', description: 'AI, devices, software & ambient computing' },
  { id: 'movies', label: 'Movies & Cinema', icon: '🎬', description: 'Indie cinema, blockbusters & film reels' },
  { id: 'music', label: 'Music Discovery', icon: '🎵', description: 'Lo-fi, ambient, acoustic & new releases' },
  { id: 'art', label: 'Art & Design', icon: '🎨', description: 'Ceramics, painting, crafts & graphic art' },
  { id: 'lifestyle', label: 'Lifestyle & Home', icon: '🌿', description: 'Slow living, botanicals & cozy spaces' },
  { id: 'fitness', label: 'Fitness & Health', icon: '🏃', description: 'Longevity, training & mindful wellness' },
  { id: 'travel', label: 'Travel & Nature', icon: '✈️', description: 'Quiet escapes, alpine trails & sea voyages' },
  { id: 'fashion', label: 'Aesthetic Fashion', icon: '👗', description: 'Minimalist wardrobes & sustainable textiles' },
  { id: 'science', label: 'Science & Cosmos', icon: '🔬', description: 'Clean energy, astronomy & discoveries' },
  { id: 'finance', label: 'Finance & Markets', icon: '📈', description: 'Regenerative finance, equities & economics' },
  { id: 'sports', label: 'Sports & Adventure', icon: '⚡', description: 'Athletic competitions & outdoor feats' },
  { id: 'entertainment', label: 'Pop Culture', icon: '✨', description: 'Series, festivals & cultural happenings' },
];

const STORAGE_KEY = 'aura_user_preferences';

const DEFAULT_CATEGORIES: Category[] = [
  'technology',
  'movies',
  'music',
  'art',
  'lifestyle',
];

interface PreferencesState {
  selectedCategories: Category[];
  feedLayout: 'grid' | 'masonry' | 'compact';
  autoPlayAudioPreview: boolean;
  liveUpdatesEnabled: boolean;
}

const initialState: PreferencesState = {
  selectedCategories: storageService.getItem<Category[]>(
    `${STORAGE_KEY}_categories`,
    DEFAULT_CATEGORIES
  ),
  feedLayout: storageService.getItem<'grid' | 'masonry' | 'compact'>(
    `${STORAGE_KEY}_layout`,
    'grid'
  ),
  autoPlayAudioPreview: storageService.getItem<boolean>(
    `${STORAGE_KEY}_autoplay`,
    false
  ),
  liveUpdatesEnabled: storageService.getItem<boolean>(
    `${STORAGE_KEY}_live_updates`,
    true
  ),
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<Category>) => {
      const cat = action.payload;
      if (state.selectedCategories.includes(cat)) {
        // Keep at least one category selected
        if (state.selectedCategories.length > 1) {
          state.selectedCategories = state.selectedCategories.filter((c) => c !== cat);
        }
      } else {
        state.selectedCategories.push(cat);
      }
      storageService.setItem(`${STORAGE_KEY}_categories`, state.selectedCategories);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      if (action.payload.length > 0) {
        state.selectedCategories = action.payload;
        storageService.setItem(`${STORAGE_KEY}_categories`, state.selectedCategories);
      }
    },
    resetCategories: (state) => {
      state.selectedCategories = DEFAULT_CATEGORIES;
      storageService.setItem(`${STORAGE_KEY}_categories`, DEFAULT_CATEGORIES);
    },
    setFeedLayout: (state, action: PayloadAction<'grid' | 'masonry' | 'compact'>) => {
      state.feedLayout = action.payload;
      storageService.setItem(`${STORAGE_KEY}_layout`, state.feedLayout);
    },
    setLiveUpdatesEnabled: (state, action: PayloadAction<boolean>) => {
      state.liveUpdatesEnabled = action.payload;
      storageService.setItem(`${STORAGE_KEY}_live_updates`, state.liveUpdatesEnabled);
    },
    setAutoPlayAudioPreview: (state, action: PayloadAction<boolean>) => {
      state.autoPlayAudioPreview = action.payload;
      storageService.setItem(`${STORAGE_KEY}_autoplay`, state.autoPlayAudioPreview);
    },
  },
});

export const {
  toggleCategory,
  setCategories,
  resetCategories,
  setFeedLayout,
  setLiveUpdatesEnabled,
  setAutoPlayAudioPreview,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
