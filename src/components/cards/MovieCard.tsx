'use client';

import React from 'react';
import { MovieContentItem } from '@/services/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { setActiveModalItem } from '@/store/slices/contentSlice';
import { Star, Heart, Film, Calendar, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  item: MovieContentItem;
}

export default function MovieCard({ item }: MovieCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorited = favorites.some((f) => f.id === item.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      onClick={() => dispatch(setActiveModalItem(item))}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-soft hover:shadow-glow-lavender border border-neutral-800 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Film Perforation Strip Header Accent */}
      <div className="h-2.5 w-full bg-neutral-950 flex items-center justify-around px-2 opacity-60">
        <span className="w-1.5 h-1.5 rounded-sm bg-neutral-700" />
        <span className="w-1.5 h-1.5 rounded-sm bg-neutral-700" />
        <span className="w-1.5 h-1.5 rounded-sm bg-neutral-700" />
        <span className="w-1.5 h-1.5 rounded-sm bg-neutral-700" />
        <span className="w-1.5 h-1.5 rounded-sm bg-neutral-700" />
        <span className="w-1.5 h-1.5 rounded-sm bg-neutral-700" />
      </div>

      {/* Cinematic Poster Media */}
      <div className="relative h-60 w-full overflow-hidden bg-neutral-950">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-bold text-amber-400 border border-amber-500/20 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{item.rating}</span>
        </div>

        {/* Release Year & Film Tag */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-neutral-800/80 backdrop-blur-md text-[10px] font-mono text-neutral-300">
            <Calendar className="w-3 h-3 text-lavender-400" />
            {item.releaseYear}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-lavender-500/20 text-lavender-300 font-semibold border border-lavender-500/30">
            {item.genre[0] || 'Cinema'}
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-100 tracking-tight leading-snug group-hover:text-lavender-400 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Actions & Cinema Details */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={handleFavorite}
            aria-label={isFavorited ? 'Remove movie from favorites' : 'Add movie to favorites'}
            className={`p-2 rounded-full transition-all active:scale-90 ${
              isFavorited
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-neutral-400 hover:text-rose-400 hover:bg-neutral-800'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? 'fill-rose-400 text-rose-400' : ''}`}
            />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-200 group-hover:bg-lavender-500 group-hover:text-neutral-950 transition-colors shadow-sm">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>View Cinema Details</span>
          </div>
        </div>
      </div>

      {/* Film Perforation Strip Footer Accent */}
      <div className="h-2 w-full bg-neutral-950 flex items-center justify-around px-2 opacity-60">
        <span className="w-1 h-1 rounded-sm bg-neutral-700" />
        <span className="w-1 h-1 rounded-sm bg-neutral-700" />
        <span className="w-1 h-1 rounded-sm bg-neutral-700" />
        <span className="w-1 h-1 rounded-sm bg-neutral-700" />
        <span className="w-1 h-1 rounded-sm bg-neutral-700" />
        <span className="w-1 h-1 rounded-sm bg-neutral-700" />
      </div>
    </motion.article>
  );
}
