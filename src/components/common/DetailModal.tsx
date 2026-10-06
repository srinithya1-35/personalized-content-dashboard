'use client';

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setActiveModalItem } from '@/store/slices/contentSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import {
  X,
  Heart,
  ExternalLink,
  Share2,
  Calendar,
  Clock,
  Star,
  Music,
  User,
  Film,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetailModal() {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.content.activeModalItem);
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorited = item ? favorites.some((f) => f.id === item.id) : false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setActiveModalItem(null));
      }
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, dispatch]);

  if (!item) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: item.url || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(item.url || window.location.href);
      alert('Link copied to clipboard! 🌸');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setActiveModalItem(null))}
          className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-charcoal-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl my-8"
        >
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Top Close Button */}
            <button
              onClick={() => dispatch(setActiveModalItem(null))}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-all shadow-md active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category Chip */}
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/25">
                {item.type} • {item.category}
              </span>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-5">
            <h2
              id="modal-title"
              className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-snug"
            >
              {item.title}
            </h2>

            {/* Metadata pills depending on type */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              {item.type === 'news' && (
                <>
                  <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                    <User className="w-4 h-4 text-lavender-500" />
                    {(item as any).author || (item as any).source}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    {(item as any).readingTimeMinutes || 4} min read
                  </span>
                </>
              )}

              {item.type === 'movie' && (
                <>
                  <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {(item as any).rating} / 10
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    {(item as any).releaseYear}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-neutral-400" />
                    {(item as any).duration || '2h 10m'}
                  </span>
                </>
              )}

              {item.type === 'music' && (
                <>
                  <span className="flex items-center gap-1.5 font-medium text-peach-600 dark:text-peach-400">
                    <Music className="w-4 h-4" />
                    {(item as any).artist}
                  </span>
                  <span>Album: {(item as any).album}</span>
                  <span className="px-2 py-0.5 rounded-full bg-peach-100 dark:bg-peach-950/40 text-peach-700 dark:text-peach-300">
                    {(item as any).moodTag || '🌸 Cozy'}
                  </span>
                </>
              )}

              {item.type === 'social' && (
                <>
                  <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                    <User className="w-4 h-4 text-rose-500" />
                    {(item as any).author?.name} ({(item as any).author?.handle})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    {(item as any).likes?.toLocaleString()} likes
                  </span>
                </>
              )}
            </div>

            {/* Full Description */}
            <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {item.description}
            </p>

            {/* Hashtags if social */}
            {item.type === 'social' && (item as any).hashtags && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(item as any).hashtags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg bg-lavender-100 dark:bg-plum-900/40 text-lavender-700 dark:text-lavender-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(toggleFavorite(item))}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                    isFavorited
                      ? 'bg-rose-500 text-white shadow-rose-200 dark:shadow-none'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited ? 'fill-white' : 'text-neutral-500 dark:text-neutral-300'}`}
                  />
                  <span>{isFavorited ? 'Saved in Favorites' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Share content"
                  className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-all shadow-sm"
                >
                  <span>Visit External Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
