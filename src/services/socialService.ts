import { SocialContentItem, Category, SupportedLanguage } from './types';
import { mockSocialData } from '@/mock/socialData';

export interface FetchSocialParams {
  category?: Category | string;
  language?: SupportedLanguage;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchSocialResult {
  items: SocialContentItem[];
  total: number;
  page: number;
  hasMore: boolean;
  isFallback: boolean;
}

// In-memory local state so like interactions feel real
let socialPostsStore = [...mockSocialData];

export const socialService = {
  async fetchSocial({
    category,
    language = 'all',
    query,
    page = 1,
    pageSize = 6,
  }: FetchSocialParams = {}): Promise<FetchSocialResult> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    let filtered = [...socialPostsStore];

    // Language filter
    if (language && language !== 'all') {
      filtered = filtered.filter((s) => s.language === language);
    }

    if (category && category !== 'all') {
      const catFiltered = filtered.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase()
      );
      if (catFiltered.length > 0) {
        filtered = catFiltered;
      }
    }

    if (query && query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.author.name.toLowerCase().includes(q) ||
          s.author.handle.toLowerCase().includes(q) ||
          s.hashtags.some((h) => h.toLowerCase().includes(q))
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

  async toggleLike(postId: string): Promise<{ postId: string; newLikes: number; liked: boolean }> {
    const post = socialPostsStore.find((p) => p.id === postId);
    if (!post) {
      return { postId, newLikes: 0, liked: false };
    }
    post.likes += 1;
    return { postId, newLikes: post.likes, liked: true };
  },
};
