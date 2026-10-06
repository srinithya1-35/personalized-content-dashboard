import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import UnifiedFeed from '@/components/feed/UnifiedFeed';
import { fetchUnifiedFeed } from '@/store/slices/contentSlice';

describe('Unified Feed Integration Flow', () => {
  it('dispatches fetchUnifiedFeed and populates feed items into Redux and DOM', async () => {
    render(
      <Provider store={store}>
        <UnifiedFeed />
      </Provider>
    );

    // Initial dispatch is triggered on mount
    await waitFor(() => {
      const state = store.getState();
      expect(state.content.feedItems.length).toBeGreaterThan(0);
    });

    // Content should be rendered in the document
    await waitFor(() => {
      expect(screen.getByText(/showing/i)).toBeInTheDocument();
      expect(screen.getByText(/drag cards to reorder your feed/i)).toBeInTheDocument();
    });
  });
});
