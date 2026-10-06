'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchUnifiedFeed, fetchMoreFeed } from '@/store/slices/contentSlice';
import { setFeedOrder, resetFeedOrder } from '@/store/slices/feedOrderSlice';
import { ContentItem } from '@/services/types';
import ContentCardWrapper from '@/components/cards/ContentCardWrapper';
import CardSkeleton from '@/components/common/CardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { Reorder, motion } from 'framer-motion';
import {
  GripVertical,
  RotateCcw,
  Sparkles,
  ArrowDown,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';

export default function UnifiedFeed() {
  const dispatch = useAppDispatch();
  const feedItems = useAppSelector((state) => state.content.feedItems);
  const feedStatus = useAppSelector((state) => state.content.feedStatus);
  const feedError = useAppSelector((state) => state.content.feedError);
  const feedHasMore = useAppSelector((state) => state.content.feedHasMore);
  const isFetchingMore = useAppSelector((state) => state.content.isFetchingMore);
  const customOrderIds = useAppSelector((state) => state.feedOrder.customOrderIds);
  const selectedCategories = useAppSelector(
    (state) => state.preferences.selectedCategories
  );

  const [orderedItems, setOrderedItems] = useState<ContentItem[]>([]);

  // Initial fetch when categories change
  useEffect(() => {
    dispatch(fetchUnifiedFeed({ page: 1, refresh: true }));
  }, [selectedCategories, dispatch]);

  // Sync feedItems with custom order
  useEffect(() => {
    if (!feedItems || feedItems.length === 0) {
      setOrderedItems([]);
      return;
    }

    if (customOrderIds && customOrderIds.length > 0) {
      const orderMap = new Map(customOrderIds.map((id, index) => [id, index]));
      const sorted = [...feedItems].sort((a, b) => {
        const orderA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 999;
        const orderB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 999;
        return orderA - orderB;
      });
      setOrderedItems(sorted);
    } else {
      setOrderedItems(feedItems);
    }
  }, [feedItems, customOrderIds]);

  const handleReorder = (newOrder: ContentItem[]) => {
    setOrderedItems(newOrder);
    dispatch(setFeedOrder(newOrder.map((item) => item.id)));
  };

  const handleResetOrder = () => {
    dispatch(resetFeedOrder());
    setOrderedItems(feedItems);
  };

  const handleLoadMore = () => {
    dispatch(fetchMoreFeed());
  };

  if (feedStatus === 'loading' && orderedItems.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CardSkeleton count={8} />
      </div>
    );
  }

  if (feedStatus === 'failed' && orderedItems.length === 0) {
    return (
      <ErrorState
        title="Could not load your personalized feed"
        message={feedError || 'Please check your connection and try again.'}
        onRetry={() => dispatch(fetchUnifiedFeed({ page: 1, refresh: true }))}
      />
    );
  }

  if (orderedItems.length === 0 && feedStatus === 'succeeded') {
    return (
      <EmptyState
        title="No content matching your interests yet"
        description="Try adjusting your preferred categories in Settings to unlock fresh discoveries."
        actionText="Adjust Preferences"
        actionHref="/settings"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Subheader Toolbar with Drag & Drop Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1 font-medium text-lavender-700 dark:text-lavender-300 bg-lavender-100/70 dark:bg-plum-900/50 px-2.5 py-1 rounded-full">
            <GripVertical className="w-3.5 h-3.5" />
            Drag cards to reorder your feed
          </span>
          {customOrderIds.length > 0 && (
            <button
              onClick={handleResetOrder}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset custom order</span>
            </button>
          )}
        </div>

        <div className="text-xs text-neutral-400">
          Showing <span className="font-semibold text-neutral-700 dark:text-neutral-200">{orderedItems.length}</span> curated items
        </div>
      </div>

      {/* Interactive Reorder Grid using Framer Motion */}
      <Reorder.Group
        axis="y"
        values={orderedItems}
        onReorder={handleReorder}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none"
      >
        {orderedItems.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            whileDrag={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', zIndex: 40 }}
            className="cursor-grab active:cursor-grabbing relative"
          >
            {/* Drag Handle Floating Cue */}
            <div
              className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 shadow-sm"
              title="Drag to reorder"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            <ContentCardWrapper item={item} />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Infinite Scroll / Load More Action */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
        {feedHasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-white dark:bg-charcoal-900 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:scale-102 active:scale-98 transition-all shadow-soft disabled:opacity-50"
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-lavender-500" />
                <span>Gathering more stories...</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-lavender-500" />
                <span>Load More Discoveries</span>
              </>
            )}
          </button>
        ) : (
          <p className="text-xs text-neutral-400">
            🌿 You&apos;re completely up to date with your personalized feed.
          </p>
        )}
      </div>
    </div>
  );
}
