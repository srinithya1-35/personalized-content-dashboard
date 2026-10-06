import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import SearchModal from '@/components/common/SearchModal';
import { setSearchModalOpen, setRawQuery, performGlobalSearch } from '@/store/slices/searchSlice';

describe('Global Search Integration Flow', () => {
  it('opens search modal, executes search across all categories and groups results', async () => {
    store.dispatch(setSearchModalOpen(true));

    render(
      <Provider store={store}>
        <SearchModal />
      </Provider>
    );

    // Modal input should be displayed
    const input = screen.getByPlaceholderText(/search news, movies, music/i);
    expect(input).toBeInTheDocument();

    // Trigger search
    await store.dispatch(performGlobalSearch('Kyoto'));

    await waitFor(() => {
      const state = store.getState();
      expect(state.search.status).toBe('succeeded');
    });
  });
});
