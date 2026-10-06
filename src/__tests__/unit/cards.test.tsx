import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import NewsCard from '@/components/cards/NewsCard';
import MovieCard from '@/components/cards/MovieCard';
import MusicCard from '@/components/cards/MusicCard';
import SocialCard from '@/components/cards/SocialCard';
import { mockNewsData } from '@/mock/newsData';
import { mockMovieData } from '@/mock/movieData';
import { mockMusicData } from '@/mock/musicData';
import { mockSocialData } from '@/mock/socialData';

function renderWithStore(ui: React.ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('Content Cards', () => {
  it('renders NewsCard with title, category, and source', () => {
    const item = mockNewsData[0];
    renderWithStore(<NewsCard item={item} />);

    expect(screen.getByText(item.title)).toBeInTheDocument();
    expect(screen.getByText(item.source)).toBeInTheDocument();
    expect(screen.getByText('Read More')).toBeInTheDocument();
  });

  it('renders MovieCard with cinema rating and release year', () => {
    const item = mockMovieData[0];
    renderWithStore(<MovieCard item={item} />);

    expect(screen.getByText(item.title)).toBeInTheDocument();
    expect(screen.getByText(String(item.rating))).toBeInTheDocument();
    expect(screen.getByText(String(item.releaseYear))).toBeInTheDocument();
  });

  it('renders MusicCard with artist, duration, and play button', () => {
    const item = mockMusicData[0];
    renderWithStore(<MusicCard item={item} />);

    expect(screen.getByText(item.title)).toBeInTheDocument();
    expect(screen.getByText(item.artist)).toBeInTheDocument();
    expect(screen.getByText(item.duration)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play audio preview/i })).toBeInTheDocument();
  });

  it('renders SocialCard with author handle, caption, and like counter', () => {
    const item = mockSocialData[0];
    renderWithStore(<SocialCard item={item} />);

    expect(screen.getByText(item.author.name)).toBeInTheDocument();
    expect(screen.getByText(item.author.handle)).toBeInTheDocument();
    expect(screen.getByText(item.title)).toBeInTheDocument();
  });
});
