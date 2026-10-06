import { describe, it, expect } from 'vitest';
import { store } from '@/store';
import { setLanguage } from '@/store/slices/preferencesSlice';
import { newsService } from '@/services/newsService';
import { movieService } from '@/services/movieService';
import { musicService } from '@/services/musicService';
import { socialService } from '@/services/socialService';
import { fetchUnifiedFeed } from '@/store/slices/contentSlice';

describe('Multi-Language Content Preference Flow', () => {
  it('filters news articles strictly by Hindi language preference', async () => {
    const res = await newsService.fetchNews({ language: 'hi', pageSize: 6 });
    expect(res.items.length).toBeGreaterThan(0);
    res.items.forEach((item) => {
      expect(item.language).toBe('hi');
    });
  });

  it('filters movies strictly by Kannada language preference', async () => {
    const res = await movieService.fetchMovies({ language: 'kn', pageSize: 6 });
    expect(res.items.length).toBeGreaterThan(0);
    res.items.forEach((item) => {
      expect(item.language).toBe('kn');
    });
  });

  it('filters music tracks strictly by Telugu language preference', async () => {
    const res = await musicService.fetchMusic({ language: 'te', pageSize: 6 });
    expect(res.items.length).toBeGreaterThan(0);
    res.items.forEach((item) => {
      expect(item.language).toBe('te');
      expect(item.audioPreviewUrl).toBeDefined();
    });
  });

  it('filters social posts strictly by English language preference', async () => {
    const res = await socialService.fetchSocial({ language: 'en', pageSize: 6 });
    expect(res.items.length).toBeGreaterThan(0);
    res.items.forEach((item) => {
      expect(item.language).toBe('en');
    });
  });

  it('updates Redux language preference and feeds content in that language', async () => {
    store.dispatch(setLanguage('kn'));
    const state = store.getState();
    expect(state.preferences.selectedLanguage).toBe('kn');

    await store.dispatch(fetchUnifiedFeed({ page: 1, refresh: true }));
    const feedItems = store.getState().content.feedItems;
    expect(feedItems.length).toBeGreaterThan(0);
    // At least some items in the personalized feed should match the selected language
    const knItems = feedItems.filter((i) => i.language === 'kn');
    expect(knItems.length).toBeGreaterThan(0);
  });
});
