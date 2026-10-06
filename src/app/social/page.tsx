'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchSocialSection } from '@/store/slices/contentSlice';
import SocialCard from '@/components/cards/SocialCard';
import CardSkeleton from '@/components/common/CardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LanguageSelector from '@/components/common/LanguageSelector';
import { Share2, Sparkles, ArrowDown, Loader2 } from 'lucide-react';

export default function SocialPage() {
  const dispatch = useAppDispatch();
  const socialItems = useAppSelector((state) => state.content.socialItems);
  const status = useAppSelector((state) => state.content.socialStatus);
  const page = useAppSelector((state) => state.content.socialPage);
  const hasMore = useAppSelector((state) => state.content.socialHasMore);
  const selectedLanguage = useAppSelector((state) => state.preferences.selectedLanguage);

  const [tagFilter, setTagFilter] = useState('all');
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
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-100 dark:bg-sage-950/60 text-sage-600 dark:text-sage-300 flex items-center justify-center shadow-soft">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Aesthetic Social Board
              </h1>
              <p className="text-xs text-neutral-400">
                Pottery studios, flower markets, 35mm film memories, cute pets &amp; artisan creators
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="pills" />
          </div>

          {/* Theme Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: '🌸 All Crafts' },
              { id: 'art', label: '🏺 Pottery & Craft' },
              { id: 'lifestyle', label: '🐾 Cozy Living' },
              { id: 'travel', label: '🎞️ 35mm Film' },
              { id: 'fitness', label: '🏋️ Movement' },
              { id: 'technology', label: '💻 Desk Setups' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTagFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  tagFilter === tab.id
                    ? 'bg-sage-600 text-white shadow-sm'
                    : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {status === 'loading' && socialItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardSkeleton count={8} />
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
            title="No community posts in this theme"
            description="Explore other creative themes above to find fresh inspiration."
            actionText="View All Posts"
            onActionClick={() => setTagFilter('all')}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {socialItems.map((item) => (
                <SocialCard key={item.id} item={item} />
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
                      <Loader2 className="w-4 h-4 animate-spin text-sage-500" />
                      <span>Loading aesthetic posts...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4 text-sage-500" />
                      <span>Discover More Posts</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-neutral-400">
                  ✨ You&apos;ve browsed the whole aesthetic board.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
