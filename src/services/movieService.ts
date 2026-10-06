import { MovieContentItem, Category } from './types';
import { mockMovieData } from '@/mock/movieData';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w780';

export interface FetchMoviesParams {
  category?: Category | string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchMoviesResult {
  items: MovieContentItem[];
  total: number;
  page: number;
  hasMore: boolean;
  isFallback: boolean;
}

export const movieService = {
  async fetchMovies({
    category,
    query,
    page = 1,
    pageSize = 6,
  }: FetchMoviesParams = {}): Promise<FetchMoviesResult> {
    if (TMDB_API_KEY && TMDB_API_KEY.trim().length > 0 && TMDB_API_KEY !== 'your_tmdb_api_key_here') {
      try {
        const endpoint = query
          ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
          : `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`;

        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error(`TMDB API responded with status ${res.status}`);
        }
        const data = await res.json();

        if (Array.isArray(data.results)) {
          const items: MovieContentItem[] = data.results.map((m: any) => ({
            id: `tmdb-${m.id}`,
            type: 'movie' as const,
            title: m.title || m.original_title || 'Untitled Film',
            description: m.overview || 'No synopsis provided for this cinematic feature.',
            image: m.backdrop_path
              ? `${TMDB_IMAGE_BASE}${m.backdrop_path}`
              : m.poster_path
              ? `${TMDB_IMAGE_BASE}${m.poster_path}`
              : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
            category: (category as Category) || 'movies',
            rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : 7.8,
            releaseYear: m.release_date ? parseInt(m.release_date.substring(0, 4), 10) : 2026,
            duration: '2h 10m',
            director: 'Cinematographer Showcase',
            genre: ['Drama', 'Cinema'],
            createdAt: m.release_date || new Date().toISOString(),
            url: `https://www.themoviedb.org/movie/${m.id}`,
          }));

          const total = data.total_results || items.length;
          return {
            items: items.slice(0, pageSize),
            total,
            page,
            hasMore: page < (data.total_pages || 1),
            isFallback: false,
          };
        }
      } catch (err) {
        console.warn('[movieService] TMDB API request failed, falling back to curated mock data:', err);
      }
    }

    // Curated fallback with simulated latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockMovieData];

    if (category && category !== 'all' && category !== 'movies') {
      filtered = filtered.filter(
        (m) =>
          m.category.toLowerCase() === category.toLowerCase() ||
          m.genre.some((g) => g.toLowerCase() === category.toLowerCase())
      );
      if (filtered.length === 0) {
        filtered = mockMovieData.slice(0, 4);
      }
    }

    if (query && query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q))
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
