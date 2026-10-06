import { describe, it, expect } from 'vitest';
import favoritesReducer, {
  toggleFavorite,
  removeFavorite,
  clearAllFavorites,
  setActiveFilter,
} from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/services/types';

describe('favoritesSlice', () => {
  const dummyItem: ContentItem = {
    id: 'test-1',
    type: 'news',
    title: 'Ambient Design Evolution',
    description: 'A study in calm technology',
    image: 'https://example.com/img.jpg',
    category: 'technology',
    createdAt: '2026-10-06T12:00:00Z',
    source: 'Wired',
  };

  it('should add an item to favorites', () => {
    const initialState = { items: [], activeFilter: 'all' as const };
    const nextState = favoritesReducer(initialState, toggleFavorite(dummyItem));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe('test-1');
    expect(nextState.items[0].isFavorite).toBe(true);
  });

  it('should remove an item if toggled again', () => {
    const initialState = { items: [dummyItem], activeFilter: 'all' as const };
    const nextState = favoritesReducer(initialState, toggleFavorite(dummyItem));

    expect(nextState.items).toHaveLength(0);
  });

  it('should remove favorite by ID', () => {
    const initialState = { items: [dummyItem], activeFilter: 'all' as const };
    const nextState = favoritesReducer(initialState, removeFavorite('test-1'));

    expect(nextState.items).toHaveLength(0);
  });

  it('should clear all favorites', () => {
    const initialState = {
      items: [dummyItem, { ...dummyItem, id: 'test-2' }],
      activeFilter: 'all' as const,
    };
    const nextState = favoritesReducer(initialState, clearAllFavorites());

    expect(nextState.items).toHaveLength(0);
  });

  it('should update active filter', () => {
    const initialState = { items: [], activeFilter: 'all' as const };
    const nextState = favoritesReducer(initialState, setActiveFilter('movie'));

    expect(nextState.activeFilter).toBe('movie');
  });
});
