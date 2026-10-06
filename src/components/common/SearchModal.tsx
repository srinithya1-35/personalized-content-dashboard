'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useDebounce } from '@/hooks/useDebounce';
import {
  setSearchModalOpen,
  setRawQuery,
  performGlobalSearch,
  addRecentSearch,
  clearSearch,
} from '@/store/slices/searchSlice';
import { setActiveModalItem, setCurrentlyPlayingTrack } from '@/store/slices/contentSlice';
import {
  Search,
  X,
  Newspaper,
  Film,
  Music,
  Share2,
  Clock,
  Star,
  Play,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.search.isSearchModalOpen);
  const rawQuery = useAppSelector((state) => state.search.rawQuery);
  const results = useAppSelector((state) => state.search.results);
  const status = useAppSelector((state) => state.search.status);
  const recentSearches = useAppSelector((state) => state.search.recentSearches);

  // Debounced query with 400ms delay to satisfy debouncing requirements
  const debouncedQuery = useDebounce(rawQuery, 400);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      dispatch(performGlobalSearch(debouncedQuery));
      dispatch(addRecentSearch(debouncedQuery));
    } else {
      dispatch(clearSearch());
    }
  }, [debouncedQuery, dispatch]);

  // Global hotkey Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setSearchModalOpen(!isOpen));
      } else if (e.key === 'Escape' && isOpen) {
        dispatch(setSearchModalOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const totalResultsCount =
    results.news.length + results.movies.length + results.music.length + results.social.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setSearchModalOpen(false))}
          className="fixed inset-0 bg-charcoal-950/65 backdrop-blur-md"
        />

        {/* Search Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-charcoal-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl overflow-hidden"
        >
          {/* Search Header Input */}
          <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={rawQuery}
              onChange={(e) => dispatch(setRawQuery(e.target.value))}
              placeholder="Search news, movies, music, aesthetic posts... (e.g. 'Kantara', 'Veena', 'ISRO')"
              className="flex-1 bg-transparent text-sm sm:text-base text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
            />
            {status === 'loading' && (
              <Loader2 className="w-4 h-4 text-lavender-500 animate-spin shrink-0" />
            )}
            {rawQuery && (
              <button
                onClick={() => dispatch(setRawQuery(''))}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
              ESC
            </kbd>
          </div>

          {/* Quick Suggestions / Recents if empty query */}
          {!rawQuery.trim() && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Recent & Suggested Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => dispatch(setRawQuery(term))}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-lavender-100 dark:hover:bg-plum-900/40 hover:text-lavender-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grouped Search Results */}
          {rawQuery.trim().length > 0 && (
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {totalResultsCount === 0 && status !== 'loading' && (
                <div className="text-center py-10">
                  <p className="text-neutral-400 text-sm">
                    No results found for &quot;{rawQuery}&quot;.
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try searching for movies, ceramic art, chill music, or tech articles.
                  </p>
                </div>
              )}

              {/* News Section */}
              {results.news.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                    <Newspaper className="w-4 h-4" />
                    <span>📰 Editorial News ({results.news.length})</span>
                  </div>
                  <div className="grid gap-2">
                    {results.news.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          dispatch(setActiveModalItem(item));
                          dispatch(setSearchModalOpen(false));
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-rose-600 dark:group-hover:text-rose-400">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {item.source} • {item.readingTimeMinutes} min read
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Movies Section */}
              {results.movies.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-lavender-600 dark:text-lavender-400">
                    <Film className="w-4 h-4" />
                    <span>🎬 Cinema & Films ({results.movies.length})</span>
                  </div>
                  <div className="grid gap-2">
                    {results.movies.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          dispatch(setActiveModalItem(item));
                          dispatch(setSearchModalOpen(false));
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-lavender-600 dark:group-hover:text-lavender-400">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                            <span className="flex items-center gap-0.5 text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {item.rating}
                            </span>
                            <span>• {item.releaseYear}</span>
                            <span>• {item.genre.join(', ')}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Music Section */}
              {results.music.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-peach-600 dark:text-peach-400">
                    <Music className="w-4 h-4" />
                    <span>🎵 Music Recommendations ({results.music.length})</span>
                  </div>
                  <div className="grid gap-2">
                    {results.music.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            dispatch(setActiveModalItem(item));
                            dispatch(setSearchModalOpen(false));
                          }}
                        >
                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-peach-600 dark:group-hover:text-peach-400">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {item.artist} • {item.duration}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            dispatch(setCurrentlyPlayingTrack(item));
                            dispatch(setSearchModalOpen(false));
                          }}
                          className="p-2 rounded-full bg-peach-100 text-peach-700 dark:bg-plum-800 dark:text-peach-300 hover:scale-105 active:scale-95 transition-all shrink-0"
                          title="Play preview"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Section */}
              {results.social.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                    <Share2 className="w-4 h-4" />
                    <span>📱 Social Lifestyle Feed ({results.social.length})</span>
                  </div>
                  <div className="grid gap-2">
                    {results.social.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          dispatch(setActiveModalItem(item));
                          dispatch(setSearchModalOpen(false));
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-sage-600 dark:group-hover:text-sage-400">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {item.author.handle} • {item.hashtags.join(' ')}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
