'use client';

import React, { useState } from 'react';
import { SocialContentItem } from '@/services/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { setActiveModalItem } from '@/store/slices/contentSlice';
import { socialService } from '@/services/socialService';
import { Heart, Share2, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialCardProps {
  item: SocialContentItem;
}

export default function SocialCard({ item }: SocialCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorited = favorites.some((f) => f.id === item.id);

  const [likes, setLikes] = useState(item.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      await socialService.toggleLike(item.id);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

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
      alert('Post link copied to clipboard! 🌸');
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => dispatch(setActiveModalItem(item))}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-panel p-4 shadow-soft hover:shadow-soft-lg border border-neutral-200/60 dark:border-neutral-800 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Author Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-lavender-200 dark:ring-plum-800 shrink-0">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate">
              {item.author.name}
            </p>
            <p className="text-[11px] text-neutral-400 font-mono truncate">
              {item.author.handle}
            </p>
          </div>
        </div>

        <button
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove bookmark' : 'Bookmark post'}
          className={`p-1.5 rounded-full transition-all active:scale-90 ${
            isFavorited
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Aesthetic Post Media */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-3 bg-neutral-100 dark:bg-neutral-800">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-md text-neutral-700 dark:text-neutral-200 shadow-sm capitalize">
            {item.category}
          </span>
          {item.language && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-md border border-white/20">
              {item.language.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Caption & Description */}
      <div className="space-y-1.5 flex-1">
        <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 line-clamp-1">
          {item.title}
        </h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.hashtags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium text-lavender-600 dark:text-lavender-400 hover:underline"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactions Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 transition-colors active:scale-95 ${
              hasLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
            <span>{likes.toLocaleString()}</span>
          </button>

          <span className="inline-flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{item.commentsCount}</span>
          </span>
        </div>

        <button
          onClick={handleShare}
          aria-label="Share post"
          className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.article>
  );
}
