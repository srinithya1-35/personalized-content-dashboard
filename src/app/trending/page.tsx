'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchTrendingSection } from '@/store/slices/contentSlice';
import ContentCardWrapper from '@/components/cards/ContentCardWrapper';
import CardSkeleton from '@/components/common/CardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { Flame, Sparkles, Filter } from 'lucide-react';

export default function TrendingPage() {
  const dispatch = useAppDispatch();
  const trendingItems = useAppSelector((state) => state.content.trendingItems);
  const status = useAppSelector((state) => state.content.trendingStatus);
  const selectedLanguage = useAppSelector((state) => state.preferences.selectedLanguage);

  const [filterType, setFilterType] = useState<'all' | 'news' | 'movie' | 'music' | 'social'>('all');

  useEffect(() => {
    dispatch(fetchTrendingSection());
  }, [selectedLanguage, dispatch]);

  const filteredItems = trendingItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shadow-soft">
              <Flame className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Trending Now
              </h1>
              <p className="text-xs text-neutral-400">
                Top viral sensations, acclaimed films, chart toppers & beloved aesthetic drops
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'movie', label: '🎬 Movies' },
              { id: 'news', label: '📰 News' },
              { id: 'music', label: '🎵 Music' },
              { id: 'social', label: '📱 Social' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterType === tab.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {status === 'loading' && trendingItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardSkeleton count={8} />
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="No trending items in this category"
            description="Explore other categories to discover what's making waves worldwide."
            actionText="View All Trending"
            onActionClick={() => setFilterType('all')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ContentCardWrapper key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
