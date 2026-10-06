import { NewsContentItem, Category, SupportedLanguage } from './types';
import { mockNewsData } from '@/mock/newsData';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_URL = process.env.NEXT_PUBLIC_NEWS_API_URL || 'https://newsapi.org/v2';

export interface FetchNewsParams {
  category?: Category | string;
  language?: SupportedLanguage;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchNewsResult {
  items: NewsContentItem[];
  total: number;
  page: number;
  hasMore: boolean;
  isFallback: boolean;
}

export const newsService = {
  async fetchNews({
    category,
    language = 'all',
    query,
    page = 1,
    pageSize = 6,
  }: FetchNewsParams = {}): Promise<FetchNewsResult> {
    if (NEWS_API_KEY && NEWS_API_KEY.trim().length > 0 && NEWS_API_KEY !== 'your_news_api_key_here') {
      try {
        const langParam = language && language !== 'all' ? `&language=${language}` : '';
        const endpoint = query
          ? `${NEWS_API_URL}/everything?q=${encodeURIComponent(query)}${langParam}&page=${page}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
          : `${NEWS_API_URL}/top-headlines?country=us${category ? `&category=${category}` : ''}&page=${page}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;

        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error(`NewsAPI responded with status ${res.status}`);
        }
        const data = await res.json();

        if (data.status === 'ok' && Array.isArray(data.articles)) {
          const items: NewsContentItem[] = data.articles.map((art: any, idx: number) => ({
            id: `news-api-${page}-${idx}-${Date.now()}`,
            type: 'news' as const,
            title: art.title || 'Untitled Article',
            description: art.description || art.content || 'Read the full coverage for comprehensive insights and details.',
            image: art.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
            category: (category as Category) || 'technology',
            language: (language !== 'all' ? language : 'en') as 'en' | 'hi' | 'kn' | 'te',
            source: art.source?.name || 'Global News',
            author: art.author || 'Editorial Staff',
            readingTimeMinutes: 4,
            createdAt: art.publishedAt || new Date().toISOString(),
            url: art.url,
          }));

          const total = data.totalResults || items.length;
          return {
            items,
            total,
            page,
            hasMore: page * pageSize < total,
            isFallback: false,
          };
        }
      } catch (err) {
        console.warn('[newsService] Real API request failed or rate limited, falling back to curated mock data:', err);
      }
    }

    // Curated fallback with simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 250));

    let filtered = [...mockNewsData];

    // Language filter
    if (language && language !== 'all') {
      filtered = filtered.filter((item) => item.language === language);
    }

    // Category filter
    if (category && category !== 'all') {
      const catFiltered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
      if (catFiltered.length > 0) {
        filtered = catFiltered;
      }
    }

    // Query search
    if (query && query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q)
      );
    }

    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total: filtered.length,
      page,
      hasMore: startIndex + pageSize < filtered.length,
      isFallback: true,
    };
  },
};
