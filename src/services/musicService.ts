import { MusicContentItem, Category } from './types';
import { mockMusicData } from '@/mock/musicData';

export interface FetchMusicParams {
  category?: Category | string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchMusicResult {
  items: MusicContentItem[];
  total: number;
  page: number;
  hasMore: boolean;
  isFallback: boolean;
}

export const musicService = {
  async fetchMusic({
    category,
    query,
    page = 1,
    pageSize = 6,
  }: FetchMusicParams = {}): Promise<FetchMusicResult> {
    const searchTerm = query || (category && category !== 'all' ? category : 'lofi chill ambient');

    // Attempt Apple iTunes API for real live audio samples & artwork without requiring API key
    try {
      const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(
        searchTerm
      )}&entity=song&limit=${pageSize * 2}&offset=${(page - 1) * pageSize}`;

      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          const items: MusicContentItem[] = data.results.slice(0, pageSize).map((track: any) => ({
            id: `itunes-${track.trackId}`,
            type: 'music' as const,
            title: track.trackName || 'Serenade',
            description: `From the album "${track.collectionName || 'Singles'}". Released by ${track.artistName}. Genre: ${track.primaryGenreName}.`,
            image: track.artworkUrl100
              ? track.artworkUrl100.replace('100x100bb', '600x600bb')
              : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
            category: (category as Category) || 'music',
            artist: track.artistName || 'Unknown Artist',
            album: track.collectionName || 'Singles',
            duration: track.trackTimeMillis
              ? `${Math.floor(track.trackTimeMillis / 60000)}:${String(
                  Math.floor((track.trackTimeMillis % 60000) / 1000)
                ).padStart(2, '0')}`
              : '3:30',
            audioPreviewUrl: track.previewUrl,
            moodTag: '🌸 Made For You',
            createdAt: track.releaseDate || new Date().toISOString(),
            url: track.trackViewUrl,
          }));

          return {
            items,
            total: data.resultCount || items.length,
            page,
            hasMore: items.length >= pageSize,
            isFallback: false,
          };
        }
      }
    } catch (err) {
      console.warn('[musicService] Live music fetch failed, falling back to curated mock data:', err);
    }

    // Curated mock fallback with audio previews
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockMusicData];

    if (category && category !== 'all' && category !== 'music') {
      filtered = filtered.filter(
        (m) => m.category.toLowerCase() === category.toLowerCase()
      );
      if (filtered.length === 0) {
        filtered = mockMusicData.slice(0, 4);
      }
    }

    if (query && query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.artist.toLowerCase().includes(q) ||
          m.album.toLowerCase().includes(q)
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
