'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchSocialSection } from '@/store/slices/contentSlice';
import SocialCard from '@/components/cards/SocialCard';
import InstagramStoriesTray from '@/components/social/InstagramStoriesTray';
import CardSkeleton from '@/components/common/CardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LanguageSelector from '@/components/common/LanguageSelector';
import { LayoutList, Grid3X3, ArrowDown, Loader2, Sparkles, Compass } from 'lucide-react';

export default function SocialPage() {
  const dispatch = useAppDispatch();
  const socialItems = useAppSelector((state) => state.content.socialItems);
  const status = useAppSelector((state) => state.content.socialStatus);
  const page = useAppSelector((state) => state.content.socialPage);
  const hasMore = useAppSelector((state) => state.content.socialHasMore);
  const selectedLanguage = useAppSelector((state) => state.preferences.selectedLanguage);

  const [tagFilter, setTagFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(
      fetchSocialSection({
        category: tagFilter === 'all' ? undefined : tagFilter,
        language: selectedLanguage,
        page: 1,
      })
    );
  }, [tagFilter, selectedLanguage, dispatch]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await dispatch(
      fetchSocialSection({
        category: tagFilter === 'all' ? undefined : tagFilter,
        language: selectedLanguage,
        page: page + 1,
      })
    );
    setIsLoadingMore(false);
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        {/* 1. Instagram Stories Tray */}
        <InstagramStoriesTray />

        {/* 2. Feed Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-200/50 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
                Indian Aesthetic Feed
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300">
                Instagram Experience
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Filter coffee rituals, temple architecture, handloom silks &amp; artisan creators 🪔✨
            </p>
          </div>

          {/* Right controls: Language + Feed/Grid Switcher */}
          <div className="flex items-center gap-3">
            <LanguageSelector variant="pills" />

            {/* Instagram View Mode Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-neutral-100 dark:bg-charcoal-800 border border-neutral-200/60 dark:border-neutral-700">
              <button
                onClick={() => setViewMode('feed')}
                aria-label="Feed View"
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'feed'
                    ? 'bg-white dark:bg-charcoal-900 text-rose-600 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid / Explore View"
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-charcoal-900 text-rose-600 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Aesthetic Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: '🌸 All Feeds' },
            { id: 'art', label: '🪔 Arts & Handlooms' },
            { id: 'lifestyle', label: '☕ Filter Coffee & Rituals' },
            { id: 'travel', label: '🛕 Temples & Landscapes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTagFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                tagFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-soft'
                  : 'bg-white/80 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-700 border border-neutral-200/60 dark:border-neutral-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Social Feed or Explore Grid */}
        {status === 'loading' && socialItems.length === 0 ? (
          <div className="max-w-xl mx-auto space-y-6">
            <CardSkeleton count={3} />
          </div>
        ) : status === 'failed' && socialItems.length === 0 ? (
          <ErrorState
            title="Failed to load social feed"
            onRetry={() =>
              dispatch(
                fetchSocialSection({
                  category: tagFilter === 'all' ? undefined : tagFilter,
                  page: 1,
                })
              )
            }
          />
        ) : socialItems.length === 0 ? (
          <EmptyState
            title="No posts found in this language/theme"
            description="Switch your language preference or explore all categories to discover creators."
            actionText="View All Moments"
            onActionClick={() => setTagFilter('all')}
          />
        ) : viewMode === 'feed' ? (
          /* Instagram Classic Feed (Centered Column) */
          <div className="max-w-xl mx-auto space-y-8">
            {socialItems.map((item) => (
              <SocialCard key={item.id} item={item} variant="feed" />
            ))}

            {/* Pagination / Load More */}
            <div className="flex justify-center pt-6">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-white dark:bg-charcoal-900 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-soft transition-all"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                      <span>Loading moments...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4 text-rose-500" />
                      <span>Discover More Moments</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-neutral-400 font-medium">
                  🪔 You&apos;re all caught up with your feed!
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Instagram Explore Grid (3-column square) */
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
              {socialItems.map((item) => (
                <SocialCard key={item.id} item={item} variant="grid" />
              ))}
            </div>

            <div className="flex justify-center pt-4">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-charcoal-900 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 shadow-soft"
                >
                  {isLoadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Load More Photos</span>
                </button>
              ) : (
                <p className="text-xs text-neutral-400 font-medium">
                  ✨ End of photo grid
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
