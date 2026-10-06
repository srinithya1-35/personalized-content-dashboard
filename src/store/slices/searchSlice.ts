import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  NewsContentItem,
  MovieContentItem,
  MusicContentItem,
  SocialContentItem,
} from '@/services/types';
import { newsService } from '@/services/newsService';
import { movieService } from '@/services/movieService';
import { musicService } from '@/services/musicService';
import { socialService } from '@/services/socialService';

interface GroupedSearchResults {
  news: NewsContentItem[];
  movies: MovieContentItem[];
  music: MusicContentItem[];
  social: SocialContentItem[];
}

interface SearchState {
  rawQuery: string;
  debouncedQuery: string;
  results: GroupedSearchResults;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorMessage: string | null;
  isSearchModalOpen: boolean;
  recentSearches: string[];
}

const initialState: SearchState = {
  rawQuery: '',
  debouncedQuery: '',
  results: {
    news: [],
    movies: [],
    music: [],
    social: [],
  },
  status: 'idle',
  errorMessage: null,
  isSearchModalOpen: false,
  recentSearches: ['Ambient', 'Kyoto', 'Pottery', 'AI', 'Autumn'],
};

export const performGlobalSearch = createAsyncThunk(
  'search/performGlobalSearch',
  async (query: string, { rejectWithValue }) => {
    if (!query || query.trim().length === 0) {
      return { news: [], movies: [], music: [], social: [] };
    }

    try {
      const [newsRes, movieRes, musicRes, socialRes] = await Promise.all([
        newsService.fetchNews({ query, pageSize: 4 }),
        movieService.fetchMovies({ query, pageSize: 4 }),
        musicService.fetchMusic({ query, pageSize: 4 }),
        socialService.fetchSocial({ query, pageSize: 4 }),
      ]);

      return {
        news: newsRes.items,
        movies: movieRes.items,
        music: musicRes.items,
        social: socialRes.items,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to search across platforms.');
    }
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setRawQuery: (state, action: PayloadAction<string>) => {
      state.rawQuery = action.payload;
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },
    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchModalOpen = action.payload;
    },
    clearSearch: (state) => {
      state.rawQuery = '';
      state.debouncedQuery = '';
      state.results = { news: [], movies: [], music: [], social: [] };
      state.status = 'idle';
      state.errorMessage = null;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const q = action.payload.trim();
      if (q && !state.recentSearches.includes(q)) {
        state.recentSearches = [q, ...state.recentSearches.slice(0, 5)];
      }
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter((s) => s !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performGlobalSearch.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(performGlobalSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(performGlobalSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = (action.payload as string) || 'Search failed';
      });
  },
});

export const {
  setRawQuery,
  setDebouncedQuery,
  setSearchModalOpen,
  clearSearch,
  addRecentSearch,
  removeRecentSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
