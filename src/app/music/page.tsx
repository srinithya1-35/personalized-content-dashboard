'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchMusicSection, setCurrentlyPlayingTrack } from '@/store/slices/contentSlice';
import MusicCard from '@/components/cards/MusicCard';
import CardSkeleton from '@/components/common/CardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LanguageSelector from '@/components/common/LanguageSelector';
import { Music, Sparkles, Play, ArrowDown, Loader2 } from 'lucide-react';

export default function MusicPage() {
  const dispatch = useAppDispatch();
  const musicItems = useAppSelector((state) => state.content.musicItems);
  const status = useAppSelector((state) => state.content.musicStatus);
  const page = useAppSelector((state) => state.content.musicPage);
  const hasMore = useAppSelector((state) => state.content.musicHasMore);
  const selectedLanguage = useAppSelector((state) => state.preferences.selectedLanguage);

  const [moodFilter, setMoodFilter] = useState('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(
      fetchMusicSection({
        category: moodFilter === 'all' ? undefined : moodFilter,
        language: selectedLanguage,
        page: 1,
      })
    );
  }, [moodFilter, selectedLanguage, dispatch]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await dispatch(
      fetchMusicSection({
        category: moodFilter === 'all' ? undefined : moodFilter,
        language: selectedLanguage,
        page: page + 1,
      })
    );
    setIsLoadingMore(false);
  };

  const handlePlayFirst = () => {
    if (musicItems.length > 0) {
      dispatch(setCurrentlyPlayingTrack(musicItems[0]));
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-peach-100 dark:bg-peach-950/60 text-peach-600 dark:text-peach-300 flex items-center justify-center shadow-soft">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Indian Music &amp; Audio Discovery
              </h1>
              <p className="text-xs text-neutral-400">
                Regional melodies, Carnatic veena fusion, soulful sufi numbers &amp; relaxing flute raga previews 🪔🎶
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="pills" />
          </div>

          {/* Mood / Vibe Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: '🌸 All Vibes' },
              { id: 'music', label: '🪔 Soulful & Raga' },
              { id: 'lifestyle', label: '☕ Morning Chai & Sitar' },
              { id: 'art', label: '🎻 Classical & Veena' },
              { id: 'entertainment', label: '🔥 Energetic Beats' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMoodFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  moodFilter === tab.id
                    ? 'bg-peach-500 text-white shadow-sm'
                    : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cozy Hero Audio Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-peach-100 via-rose-100 to-lavender-100 dark:from-charcoal-850 dark:via-plum-950 dark:to-charcoal-900 border border-peach-200/60 dark:border-plum-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-soft">
          <div className="space-y-2 max-w-lg z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-charcoal-800/80 text-peach-700 dark:text-peach-300 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-peach-500" />
              <span>🌸 Made For You Session</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Gentle Raindrops &amp; Green Tea Sanctuary
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Click &quot;Play Preview&quot; on any card or start the curated stream below to engage calming soundscapes while browsing.
            </p>
          </div>

          <button
            onClick={handlePlayFirst}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 self-start sm:self-center"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play First Track</span>
          </button>
        </div>

        {/* Content Grid */}
        {status === 'loading' && musicItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardSkeleton type="music" count={8} />
          </div>
        ) : status === 'failed' && musicItems.length === 0 ? (
          <ErrorState
            title="Failed to load music recommendations"
            onRetry={() =>
              dispatch(
                fetchMusicSection({
                  category: moodFilter === 'all' ? undefined : moodFilter,
                  page: 1,
                })
              )
            }
          />
        ) : musicItems.length === 0 ? (
          <EmptyState
            title="No songs found in this mood"
            description="Explore our other cozy mood tags above."
            actionText="View All Music"
            onActionClick={() => setMoodFilter('all')}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {musicItems.map((item) => (
                <MusicCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="flex justify-center pt-8">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-white dark:bg-charcoal-900 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-soft"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-peach-500" />
                      <span>Loading tracks...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4 text-peach-500" />
                      <span>Discover More Tracks</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-neutral-400">
                  🎵 You&apos;ve discovered all tracks in this mood.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
