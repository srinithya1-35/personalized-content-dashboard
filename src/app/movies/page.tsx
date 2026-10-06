'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchMoviesSection } from '@/store/slices/contentSlice';
import MovieCard from '@/components/cards/MovieCard';
import CardSkeleton from '@/components/common/CardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LanguageSelector from '@/components/common/LanguageSelector';
import { Film, Clapperboard, ArrowDown, Loader2 } from 'lucide-react';

export default function MoviesPage() {
  const dispatch = useAppDispatch();
  const movieItems = useAppSelector((state) => state.content.movieItems);
  const status = useAppSelector((state) => state.content.movieStatus);
  const page = useAppSelector((state) => state.content.moviePage);
  const hasMore = useAppSelector((state) => state.content.movieHasMore);
  const selectedLanguage = useAppSelector((state) => state.preferences.selectedLanguage);

  const [genreFilter, setGenreFilter] = useState('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(
      fetchMoviesSection({
        category: genreFilter === 'all' ? undefined : genreFilter,
        language: selectedLanguage,
        page: 1,
      })
    );
  }, [genreFilter, selectedLanguage, dispatch]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await dispatch(
      fetchMoviesSection({
        category: genreFilter === 'all' ? undefined : genreFilter,
        language: selectedLanguage,
        page: page + 1,
      })
    );
    setIsLoadingMore(false);
  };

  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-plum-900/60 text-lavender-600 dark:text-lavender-300 flex items-center justify-center shadow-soft">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Cinema Reels &amp; Film Strips
              </h1>
              <p className="text-xs text-neutral-400">
                Cinematographic masterpieces, deep space odysseys, slow cinema &amp; TMDB recommendations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="pills" />
          </div>

          {/* Genre Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Cinema' },
              { id: 'Sci-Fi', label: '🪐 Sci-Fi' },
              { id: 'Drama', label: '🎭 Drama' },
              { id: 'Art', label: '🎨 Art House' },
              { id: 'Adventure', label: '🏔️ Adventure' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGenreFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  genreFilter === tab.id
                    ? 'bg-lavender-600 text-white shadow-sm'
                    : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Film Reel Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-charcoal-900 via-plum-950 to-charcoal-900 border border-neutral-800 text-white flex items-center justify-between shadow-soft-lg">
          <div className="space-y-1 z-10 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-lavender-500/20 text-lavender-300 border border-lavender-500/30">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>TMDB Verified Discovery</span>
            </div>
            <h3 className="text-lg font-bold">Featured 70mm Visual Journeys</h3>
            <p className="text-xs text-neutral-400">
              Explore films with high critical ratings and poetic visual cinematography.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 opacity-20">
            <Film className="w-20 h-20 text-lavender-300" />
          </div>
        </div>

        {/* Content Grid */}
        {status === 'loading' && movieItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardSkeleton type="movie" count={8} />
          </div>
        ) : status === 'failed' && movieItems.length === 0 ? (
          <ErrorState
            title="Failed to load cinema reels"
            onRetry={() =>
              dispatch(
                fetchMoviesSection({
                  category: genreFilter === 'all' ? undefined : genreFilter,
                  page: 1,
                })
              )
            }
          />
        ) : movieItems.length === 0 ? (
          <EmptyState
            title="No movies in this genre"
            description="Try selecting another cinematic genre above."
            actionText="View All Cinema"
            onActionClick={() => setGenreFilter('all')}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movieItems.map((item) => (
                <MovieCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="flex justify-center pt-8">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 shadow-soft"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-lavender-400" />
                      <span>Loading film reels...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4" />
                      <span>Discover More Reels</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-neutral-400">
                  🎬 You&apos;ve viewed the entire curated film catalog.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
