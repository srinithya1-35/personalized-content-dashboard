'use client';

import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchTrendingSection } from '@/store/slices/contentSlice';
import ContentCardWrapper from '@/components/cards/ContentCardWrapper';
import CardSkeleton from '@/components/common/CardSkeleton';
import { Flame, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TrendingSection() {
  const dispatch = useAppDispatch();
  const trendingItems = useAppSelector((state) => state.content.trendingItems);
  const trendingStatus = useAppSelector((state) => state.content.trendingStatus);
  const selectedLanguage = useAppSelector(
    (state) => state.preferences.selectedLanguage
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchTrendingSection());
  }, [selectedLanguage, dispatch]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shadow-sm">
            <Flame className="w-4 h-4 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
              Trending Across All Realms
            </h2>
            <p className="text-xs text-neutral-400">
              Most engaged cinema reels, editorial stories & cozy acoustic drops
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/trending"
            className="text-xs font-semibold text-lavender-700 dark:text-lavender-300 hover:underline mr-2 hidden sm:inline"
          >
            Explore all
          </Link>
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll trending left"
            className="p-1.5 rounded-full bg-white dark:bg-charcoal-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll trending right"
            className="p-1.5 rounded-full bg-white dark:bg-charcoal-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {trendingStatus === 'loading' && trendingItems.length === 0 ? (
          <div className="flex gap-5 w-full">
            <div className="min-w-[280px] max-w-[280px]">
              <CardSkeleton count={1} type="movie" />
            </div>
            <div className="min-w-[280px] max-w-[280px]">
              <CardSkeleton count={1} type="news" />
            </div>
            <div className="min-w-[280px] max-w-[280px]">
              <CardSkeleton count={1} type="music" />
            </div>
          </div>
        ) : (
          trendingItems.map((item) => (
            <div
              key={`trending-${item.id}`}
              className="min-w-[280px] sm:min-w-[300px] max-w-[320px] snap-start shrink-0"
            >
              <ContentCardWrapper item={item} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
