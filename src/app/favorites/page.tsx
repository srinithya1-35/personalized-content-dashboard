'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setActiveFilter, clearAllFavorites } from '@/store/slices/favoritesSlice';
import ContentCardWrapper from '@/components/cards/ContentCardWrapper';
import EmptyState from '@/components/common/EmptyState';
import { Heart, Trash2, Sparkles } from 'lucide-react';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.favorites.items);
  const activeFilter = useAppSelector((state) => state.favorites.activeFilter);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Your Saved Favorites
              </h1>
              <p className="text-xs text-neutral-400">
                A personal archive of your favorite articles, cinema reels, tracks & aesthetic inspiration
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(clearAllFavorites())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-rose-200/60 dark:border-rose-900/60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Favorites</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `All (${items.length})` },
              { id: 'news', label: `📰 News (${items.filter((i) => i.type === 'news').length})` },
              { id: 'movie', label: `🎬 Movies (${items.filter((i) => i.type === 'movie').length})` },
              { id: 'music', label: `🎵 Music (${items.filter((i) => i.type === 'music').length})` },
              { id: 'social', label: `📱 Social (${items.filter((i) => i.type === 'social').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveFilter(tab.id as any))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Items Grid or Empty State */}
        {items.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-8 h-8 text-rose-500 fill-rose-500" />}
            title="No favorites saved yet"
            description="Explore news stories, cinema films, songs, and social posts. Tap the heart icon on any card to save it here."
            actionText="Discover Content"
            actionHref="/"
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="No saved items in this category"
            description="You haven't bookmarked any items in this category yet."
            actionText="View All Favorites"
            onActionClick={() => dispatch(setActiveFilter('all'))}
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
