'use client';

import React from 'react';
import {
  ContentItem,
  NewsContentItem,
  MovieContentItem,
  MusicContentItem,
  SocialContentItem,
} from '@/services/types';
import NewsCard from './NewsCard';
import MovieCard from './MovieCard';
import MusicCard from './MusicCard';
import SocialCard from './SocialCard';

interface ContentCardWrapperProps {
  item: ContentItem;
}

export default function ContentCardWrapper({ item }: ContentCardWrapperProps) {
  switch (item.type) {
    case 'news':
      return <NewsCard item={item as NewsContentItem} />;
    case 'movie':
      return <MovieCard item={item as MovieContentItem} />;
    case 'music':
      return <MusicCard item={item as MusicContentItem} />;
    case 'social':
      return <SocialCard item={item as SocialContentItem} />;
    default:
      return null;
  }
}
