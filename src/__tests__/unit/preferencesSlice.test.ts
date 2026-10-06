import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  toggleCategory,
  setCategories,
  setLanguage,
  resetCategories,
  setFeedLayout,
  setLiveUpdatesEnabled,
} from '@/store/slices/preferencesSlice';

describe('preferencesSlice', () => {
  const initialState = {
    selectedCategories: ['technology', 'art'] as any[],
    selectedLanguage: 'all' as const,
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

  it('should update selected language preference', () => {
    const nextStateHi = preferencesReducer(initialState, setLanguage('hi'));
    expect(nextStateHi.selectedLanguage).toBe('hi');

    const nextStateKn = preferencesReducer(nextStateHi, setLanguage('kn'));
    expect(nextStateKn.selectedLanguage).toBe('kn');

    const nextStateTe = preferencesReducer(nextStateKn, setLanguage('te'));
    expect(nextStateTe.selectedLanguage).toBe('te');
  });

  it('should reset categories and language to defaults', () => {
    const customState = {
      ...initialState,
      selectedCategories: ['sports'] as any[],
      selectedLanguage: 'hi' as const,
    };
    const nextState = preferencesReducer(customState, resetCategories());
    expect(nextState.selectedCategories.length).toBeGreaterThan(1);
    expect(nextState.selectedCategories).toContain('technology');
    expect(nextState.selectedLanguage).toBe('all');
  });

  it('should set feed layout and live updates', () => {
    let state = preferencesReducer(initialState, setFeedLayout('compact'));
    expect(state.feedLayout).toBe('compact');

    state = preferencesReducer(state, setLiveUpdatesEnabled(false));
    expect(state.liveUpdatesEnabled).toBe(false);
  });
});
