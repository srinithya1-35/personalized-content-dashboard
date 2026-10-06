'use client';

import React from 'react';
import { MusicContentItem } from '@/services/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { setCurrentlyPlayingTrack, setIsPlayingAudio } from '@/store/slices/contentSlice';
import { Play, Pause, Heart, Sparkles, Disc, Music } from 'lucide-react';
import { motion } from 'framer-motion';

interface MusicCardProps {
  item: MusicContentItem;
}

export default function MusicCard({ item }: MusicCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const currentTrack = useAppSelector((state) => state.content.currentlyPlayingTrack);
  const isGlobalPlaying = useAppSelector((state) => state.content.isPlayingAudio);

  const isFavorited = favorites.some((f) => f.id === item.id);
  const isThisPlaying = currentTrack?.id === item.id && isGlobalPlaying;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisPlaying) {
      dispatch(setIsPlayingAudio(false));
    } else {
      dispatch(setCurrentlyPlayingTrack(item));
      dispatch(setIsPlayingAudio(true));
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-peach-50/70 dark:bg-charcoal-850/80 p-4 border border-peach-200/50 dark:border-plum-900/50 shadow-soft hover:shadow-soft-lg transition-all duration-300 h-full"
    >
      {/* Top Cute Tag */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-charcoal-900/90 text-peach-700 dark:text-peach-300 shadow-sm border border-peach-200/40 dark:border-plum-800">
          <Sparkles className="w-3.5 h-3.5 text-peach-500" />
          <span>{item.moodTag || '🌸 Made for You'}</span>
        </span>

        <span className="text-[11px] font-mono text-neutral-400">
          {item.duration}
        </span>
      </div>

      {/* Album Artwork & Vinyl Effect */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 shadow-sm bg-neutral-100 dark:bg-neutral-800">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Play / Pause Overlay Button */}
        <button
          onClick={handleTogglePlay}
          aria-label={isThisPlaying ? 'Pause audio track' : 'Play audio preview'}
          className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isThisPlaying
              ? 'bg-rose-500 text-white scale-105'
              : 'bg-white text-neutral-900 hover:scale-110 active:scale-95'
          }`}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Animated equalizer waves when playing */}
        {isThisPlaying && (
          <div className="absolute bottom-3 left-3 flex items-end gap-1 h-5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md">
            <span className="w-1 bg-peach-300 rounded-full animate-bounce h-4" />
            <span className="w-1 bg-rose-300 rounded-full animate-bounce h-2 delay-100" />
            <span className="w-1 bg-lavender-300 rounded-full animate-bounce h-5 delay-200" />
            <span className="w-1 bg-peach-300 rounded-full animate-bounce h-3 delay-75" />
          </div>
        )}
      </div>

      {/* Song & Artist Info */}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-peach-600 dark:group-hover:text-peach-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate">
          {item.artist}
        </p>
      </div>

      {/* Footer Details & Favorite */}
      <div className="mt-4 pt-3 border-t border-peach-200/40 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-[11px] text-neutral-400 italic truncate max-w-[170px]">
          {item.album}
        </span>

        <button
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove track from favorites' : 'Add track to favorites'}
          className={`p-2 rounded-full transition-all active:scale-90 ${
            isFavorited
              ? 'bg-rose-100 text-rose-500 dark:bg-rose-950/50'
              : 'text-neutral-400 hover:text-rose-500 hover:bg-white/60 dark:hover:bg-neutral-800'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>
      </div>
    </motion.article>
  );
}
