import { describe, it, expect, beforeEach } from 'vitest';
import preferencesReducer, {
  toggleCategory,
  setCategories,
  resetCategories,
  setFeedLayout,
  setLiveUpdatesEnabled,
} from '@/store/slices/preferencesSlice';

describe('preferencesSlice', () => {
  const initialState = {
    selectedCategories: ['technology', 'art'] as any[],
    feedLayout: 'grid' as const,
    autoPlayAudioPreview: false,
    liveUpdatesEnabled: true,
  };

  it('should toggle on a new category', () => {
    const nextState = preferencesReducer(initialState, toggleCategory('fitness'));
    expect(nextState.selectedCategories).toContain('fitness');
  });

  it('should toggle off an existing category if multiple remain', () => {
    const nextState = preferencesReducer(initialState, toggleCategory('technology'));
    expect(nextState.selectedCategories).not.toContain('technology');
    expect(nextState.selectedCategories).toContain('art');
  });

  it('should prevent deselecting the last remaining category', () => {
    const singleCatState = {
      ...initialState,
      selectedCategories: ['technology'] as any[],
    };
    const nextState = preferencesReducer(singleCatState, toggleCategory('technology'));
    expect(nextState.selectedCategories).toEqual(['technology']);
  });

  it('should reset categories to defaults', () => {
    const customState = {
      ...initialState,
      selectedCategories: ['sports'] as any[],
    };
    const nextState = preferencesReducer(customState, resetCategories());
    expect(nextState.selectedCategories.length).toBeGreaterThan(1);
    expect(nextState.selectedCategories).toContain('technology');
  });

  it('should set feed layout and live updates', () => {
    let state = preferencesReducer(initialState, setFeedLayout('compact'));
    expect(state.feedLayout).toBe('compact');

    state = preferencesReducer(state, setLiveUpdatesEnabled(false));
    expect(state.liveUpdatesEnabled).toBe(false);
  });
});
