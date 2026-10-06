import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ContentItem,
  NewsContentItem,
  MovieContentItem,
  MusicContentItem,
  SocialContentItem,
  Category,
} from '@/services/types';
import { newsService } from '@/services/newsService';
import { movieService } from '@/services/movieService';
import { musicService } from '@/services/musicService';
import { socialService } from '@/services/socialService';
import { RootState } from '../index';

interface ContentState {
  // Unified personalized feed
  feedItems: ContentItem[];
  feedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  feedPage: number;
  feedHasMore: boolean;
  isFetchingMore: boolean;
  feedError: string | null;

  // Dedicated sections
  newsItems: NewsContentItem[];
  newsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  newsPage: number;
  newsHasMore: boolean;

  movieItems: MovieContentItem[];
  movieStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  moviePage: number;
  movieHasMore: boolean;

  musicItems: MusicContentItem[];
  musicStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  musicPage: number;
  musicHasMore: boolean;

  socialItems: SocialContentItem[];
  socialStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  socialPage: number;
  socialHasMore: boolean;

  // Trending section
  trendingItems: ContentItem[];
  trendingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

  // Global interactive states
  currentlyPlayingTrack: MusicContentItem | null;
  isPlayingAudio: boolean;
  activeModalItem: ContentItem | null;
}

const initialState: ContentState = {
  feedItems: [],
  feedStatus: 'idle',
  feedPage: 1,
  feedHasMore: true,
  isFetchingMore: false,
  feedError: null,

  newsItems: [],
  newsStatus: 'idle',
  newsPage: 1,
  newsHasMore: true,

  movieItems: [],
  movieStatus: 'idle',
  moviePage: 1,
  movieHasMore: true,

  musicItems: [],
  musicStatus: 'idle',
  musicPage: 1,
  musicHasMore: true,

  socialItems: [],
  socialStatus: 'idle',
  socialPage: 1,
  socialHasMore: true,

  trendingItems: [],
  trendingStatus: 'idle',

  currentlyPlayingTrack: null,
  isPlayingAudio: false,
  activeModalItem: null,
};

// Helper to interleave content items into a unified discovery stream
function interleaveContent(
  news: NewsContentItem[],
  movies: MovieContentItem[],
  music: MusicContentItem[],
  social: SocialContentItem[]
): ContentItem[] {
  const result: ContentItem[] = [];
  const maxLen = Math.max(news.length, movies.length, music.length, social.length);

  for (let i = 0; i < maxLen; i++) {
    if (news[i]) result.push(news[i]);
    if (movies[i]) result.push(movies[i]);
    if (music[i]) result.push(music[i]);
    if (social[i]) result.push(social[i]);
  }
  return result;
}

export const fetchUnifiedFeed = createAsyncThunk(
  'content/fetchUnifiedFeed',
  async (options: { page?: number; refresh?: boolean } = {}, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const categories = state.preferences.selectedCategories;
    const primaryCategory = categories[0] || 'technology';
    const secondaryCategory = categories[1] || 'art';
    const page = options.page || 1;

    try {
      const [newsRes, movieRes, musicRes, socialRes] = await Promise.all([
        newsService.fetchNews({ category: primaryCategory, page, pageSize: 3 }),
        movieService.fetchMovies({ category: secondaryCategory, page, pageSize: 3 }),
        musicService.fetchMusic({ category: categories[2] || 'music', page, pageSize: 3 }),
        socialService.fetchSocial({ category: categories[3] || 'art', page, pageSize: 3 }),
      ]);

      const merged = interleaveContent(
        newsRes.items,
        movieRes.items,
        musicRes.items,
        socialRes.items
      );

      const hasMore =
        newsRes.hasMore || movieRes.hasMore || musicRes.hasMore || socialRes.hasMore;

      return { items: merged, page, hasMore, isRefresh: options.refresh || page === 1 };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch personalized feed');
    }
  }
);

export const fetchMoreFeed = createAsyncThunk(
  'content/fetchMoreFeed',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    if (state.content.isFetchingMore || !state.content.feedHasMore) return;
    const nextPage = state.content.feedPage + 1;
    return dispatch(fetchUnifiedFeed({ page: nextPage, refresh: false }));
  }
);

export const fetchNewsSection = createAsyncThunk(
  'content/fetchNewsSection',
  async (params: { category?: Category | string; page?: number } = {}, { rejectWithValue }) => {
    try {
      const res = await newsService.fetchNews({
        category: params.category,
        page: params.page || 1,
        pageSize: 6,
      });
      return { items: res.items, page: res.page, hasMore: res.hasMore };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch news');
    }
  }
);

export const fetchMoviesSection = createAsyncThunk(
  'content/fetchMoviesSection',
  async (params: { category?: Category | string; page?: number } = {}, { rejectWithValue }) => {
    try {
      const res = await movieService.fetchMovies({
        category: params.category,
        page: params.page || 1,
        pageSize: 6,
      });
      return { items: res.items, page: res.page, hasMore: res.hasMore };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch movies');
    }
  }
);

export const fetchMusicSection = createAsyncThunk(
  'content/fetchMusicSection',
  async (params: { category?: Category | string; page?: number } = {}, { rejectWithValue }) => {
    try {
      const res = await musicService.fetchMusic({
        category: params.category,
        page: params.page || 1,
        pageSize: 6,
      });
      return { items: res.items, page: res.page, hasMore: res.hasMore };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch music');
    }
  }
);

export const fetchSocialSection = createAsyncThunk(
  'content/fetchSocialSection',
  async (params: { category?: Category | string; page?: number } = {}, { rejectWithValue }) => {
    try {
      const res = await socialService.fetchSocial({
        category: params.category,
        page: params.page || 1,
        pageSize: 6,
      });
      return { items: res.items, page: res.page, hasMore: res.hasMore };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch social posts');
    }
  }
);

export const fetchTrendingSection = createAsyncThunk(
  'content/fetchTrendingSection',
  async (_, { rejectWithValue }) => {
    try {
      const [newsRes, movieRes, musicRes, socialRes] = await Promise.all([
        newsService.fetchNews({ pageSize: 2 }),
        movieService.fetchMovies({ pageSize: 2 }),
        musicService.fetchMusic({ pageSize: 2 }),
        socialService.fetchSocial({ pageSize: 2 }),
      ]);

      const trendingList = [
        ...movieRes.items.slice(0, 2),
        ...newsRes.items.slice(0, 2),
        ...musicRes.items.slice(0, 2),
        ...socialRes.items.slice(0, 2),
      ];

      return trendingList;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch trending content');
    }
  }
);

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.feedItems = action.payload;
    },
    setCurrentlyPlayingTrack: (state, action: PayloadAction<MusicContentItem | null>) => {
      state.currentlyPlayingTrack = action.payload;
      state.isPlayingAudio = !!action.payload;
    },
    setIsPlayingAudio: (state, action: PayloadAction<boolean>) => {
      state.isPlayingAudio = action.payload;
    },
    setActiveModalItem: (state, action: PayloadAction<ContentItem | null>) => {
      state.activeModalItem = action.payload;
    },
    insertLiveItem: (state, action: PayloadAction<ContentItem>) => {
      // Prepend live incoming post/news
      state.feedItems.unshift(action.payload);
      if (action.payload.type === 'news') {
        state.newsItems.unshift(action.payload as NewsContentItem);
      } else if (action.payload.type === 'social') {
        state.socialItems.unshift(action.payload as SocialContentItem);
      }
    },
  },
  extraReducers: (builder) => {
    // Unified feed
    builder
      .addCase(fetchUnifiedFeed.pending, (state, action) => {
        if (action.meta.arg?.page && action.meta.arg.page > 1) {
          state.isFetchingMore = true;
        } else {
          state.feedStatus = 'loading';
        }
        state.feedError = null;
      })
      .addCase(fetchUnifiedFeed.fulfilled, (state, action) => {
        state.feedStatus = 'succeeded';
        state.isFetchingMore = false;
        state.feedPage = action.payload.page;
        state.feedHasMore = action.payload.hasMore;
        if (action.payload.isRefresh) {
          state.feedItems = action.payload.items;
        } else {
          // Avoid duplicate IDs
          const existingIds = new Set(state.feedItems.map((item) => item.id));
          const newItems = action.payload.items.filter((item) => !existingIds.has(item.id));
          state.feedItems = [...state.feedItems, ...newItems];
        }
      })
      .addCase(fetchUnifiedFeed.rejected, (state, action) => {
        state.feedStatus = 'failed';
        state.isFetchingMore = false;
        state.feedError = (action.payload as string) || 'Failed to load content';
      });

    // News Section
    builder
      .addCase(fetchNewsSection.pending, (state) => {
        state.newsStatus = 'loading';
      })
      .addCase(fetchNewsSection.fulfilled, (state, action) => {
        state.newsStatus = 'succeeded';
        state.newsPage = action.payload.page;
        state.newsHasMore = action.payload.hasMore;
        if (action.payload.page === 1) {
          state.newsItems = action.payload.items;
        } else {
          state.newsItems = [...state.newsItems, ...action.payload.items];
        }
      })
      .addCase(fetchNewsSection.rejected, (state) => {
        state.newsStatus = 'failed';
      });

    // Movies Section
    builder
      .addCase(fetchMoviesSection.pending, (state) => {
        state.movieStatus = 'loading';
      })
      .addCase(fetchMoviesSection.fulfilled, (state, action) => {
        state.movieStatus = 'succeeded';
        state.moviePage = action.payload.page;
        state.movieHasMore = action.payload.hasMore;
        if (action.payload.page === 1) {
          state.movieItems = action.payload.items;
        } else {
          state.movieItems = [...state.movieItems, ...action.payload.items];
        }
      })
      .addCase(fetchMoviesSection.rejected, (state) => {
        state.movieStatus = 'failed';
      });

    // Music Section
    builder
      .addCase(fetchMusicSection.pending, (state) => {
        state.musicStatus = 'loading';
      })
      .addCase(fetchMusicSection.fulfilled, (state, action) => {
        state.musicStatus = 'succeeded';
        state.musicPage = action.payload.page;
        state.musicHasMore = action.payload.hasMore;
        if (action.payload.page === 1) {
          state.musicItems = action.payload.items;
        } else {
          state.musicItems = [...state.musicItems, ...action.payload.items];
        }
      })
      .addCase(fetchMusicSection.rejected, (state) => {
        state.musicStatus = 'failed';
      });

    // Social Section
    builder
      .addCase(fetchSocialSection.pending, (state) => {
        state.socialStatus = 'loading';
      })
      .addCase(fetchSocialSection.fulfilled, (state, action) => {
        state.socialStatus = 'succeeded';
        state.socialPage = action.payload.page;
        state.socialHasMore = action.payload.hasMore;
        if (action.payload.page === 1) {
          state.socialItems = action.payload.items;
        } else {
          state.socialItems = [...state.socialItems, ...action.payload.items];
        }
      })
      .addCase(fetchSocialSection.rejected, (state) => {
        state.socialStatus = 'failed';
      });

    // Trending Section
    builder
      .addCase(fetchTrendingSection.pending, (state) => {
        state.trendingStatus = 'loading';
      })
      .addCase(fetchTrendingSection.fulfilled, (state, action) => {
        state.trendingStatus = 'succeeded';
        state.trendingItems = action.payload;
      })
      .addCase(fetchTrendingSection.rejected, (state) => {
        state.trendingStatus = 'failed';
      });
  },
});

export const {
  setFeedItems,
  setCurrentlyPlayingTrack,
  setIsPlayingAudio,
  setActiveModalItem,
  insertLiveItem,
} = contentSlice.actions;

export default contentSlice.reducer;
