export type ContentType = 'news' | 'movie' | 'music' | 'social';

export type SupportedLanguage = 'all' | 'en' | 'hi' | 'kn' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'all', label: 'All Languages', nativeLabel: 'All Languages', flag: '🌐' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
];

export type Category =
  | 'technology'
  | 'sports'
  | 'finance'
  | 'entertainment'
  | 'movies'
  | 'music'
  | 'art'
  | 'fitness'
  | 'lifestyle'
  | 'travel'
  | 'science'
  | 'fashion';

export interface BaseContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image: string;
  category: Category | string;
  language: 'en' | 'hi' | 'kn' | 'te';
  url?: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface NewsContentItem extends BaseContentItem {
  type: 'news';
  source: string;
  author?: string;
  readingTimeMinutes?: number;
}

export interface MovieContentItem extends BaseContentItem {
  type: 'movie';
  rating: number; // e.g. 8.4
  releaseYear: number;
  duration?: string; // e.g. "2h 15m"
  director?: string;
  genre: string[];
}

export interface MusicContentItem extends BaseContentItem {
  type: 'music';
  artist: string;
  album: string;
  duration: string; // e.g. "3:45"
  audioPreviewUrl?: string; // real 30s audio sample
  moodTag?: string; // e.g. "🌸 Cozy & Dreamy", "🌿 Chill Nature"
}

export interface SocialContentItem extends BaseContentItem {
  type: 'social';
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  likes: number;
  commentsCount: number;
  hashtags: string[];
}

export type ContentItem =
  | NewsContentItem
  | MovieContentItem
  | MusicContentItem
  | SocialContentItem;

export interface UserPreferences {
  categories: Category[];
  selectedLanguage: SupportedLanguage;
  darkMode: boolean;
  compactView: boolean;
  soundEffects: boolean;
  autoPlayPreview: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  isLoggedIn: boolean;
}
