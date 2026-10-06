'use client';

import React from 'react';
import { NewsContentItem } from '@/services/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { setActiveModalItem } from '@/store/slices/contentSlice';
import { Heart, Share2, Clock, ArrowUpRight, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsCardProps {
  item: NewsContentItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorited = favorites.some((f) => f.id === item.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: item.url || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(item.url || window.location.href);
      alert('Article link copied to clipboard! 🌸');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => dispatch(setActiveModalItem(item))}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-panel shadow-soft hover:shadow-soft-lg border border-neutral-200/60 dark:border-neutral-800 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Editorial Image with Subtle Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Source Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-md text-[11px] font-semibold text-neutral-800 dark:text-neutral-100 shadow-sm">
          <Newspaper className="w-3 h-3 text-rose-500" />
          <span>{item.source}</span>
        </div>

        {/* Category Pill & Language Badge */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-rose-500/80 text-white backdrop-blur-sm">
            {item.category}
          </span>
          {item.language && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 text-neutral-200 backdrop-blur-sm border border-white/20">
              {item.language.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Body / Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-2">
            <span>By {item.author || 'Staff'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.readingTimeMinutes || 4} min
            </span>
          </div>

          <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {item.title}
          </h3>

          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleFavorite}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-full transition-all active:scale-90 ${
                isFavorited
                  ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40'
                  : 'text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>

            <button
              onClick={handleShare}
              aria-label="Share article"
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            <span>Read More</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
