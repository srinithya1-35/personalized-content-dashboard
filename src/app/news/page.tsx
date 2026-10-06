'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchNewsSection } from '@/store/slices/contentSlice';
import NewsCard from '@/components/cards/NewsCard';
import CardSkeleton from '@/components/common/CardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import CategoryPills from '@/components/common/CategoryPills';
import LanguageSelector from '@/components/common/LanguageSelector';
import { Newspaper, ArrowDown, Loader2 } from 'lucide-react';

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const newsItems = useAppSelector((state) => state.content.newsItems);
  const status = useAppSelector((state) => state.content.newsStatus);
  const page = useAppSelector((state) => state.content.newsPage);
  const hasMore = useAppSelector((state) => state.content.newsHasMore);

  const selectedLanguage = useAppSelector((state) => state.preferences.selectedLanguage);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(
      fetchNewsSection({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        language: selectedLanguage,
        page: 1,
      })
    );
  }, [selectedCategory, selectedLanguage, dispatch]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await dispatch(
      fetchNewsSection({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
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
        <div className="space-y-4 pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shadow-soft shrink-0">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                  Editorial Magazine &amp; News
                </h1>
                <p className="text-xs text-neutral-400">
                  ISRO space exploration, Bengaluru &amp; Hyderabad AI tech, heritage arts and national developments 📰🇮🇳
                </p>
              </div>
            </div>

            {/* Language Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <LanguageSelector variant="pills" />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Filter by Realm
          </p>
          <CategoryPills
            interactive={false}
            showAllOption={true}
            selectedCategory={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat)}
          />
        </div>

        {/* Content */}
        {status === 'loading' && newsItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <CardSkeleton type="news" count={8} />
          </div>
        ) : status === 'failed' && newsItems.length === 0 ? (
          <ErrorState
            title="Failed to load editorial articles"
            onRetry={() =>
              dispatch(
                fetchNewsSection({
                  category: selectedCategory === 'all' ? undefined : selectedCategory,
                  page: 1,
                })
              )
            }
          />
        ) : newsItems.length === 0 ? (
          <EmptyState
            title="No articles found in this category"
            description="Try selecting a different realm from the chips above."
            actionText="View All News"
            onActionClick={() => setSelectedCategory('all')}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {newsItems.map((item) => (
                <NewsCard key={item.id} item={item} />
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
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                      <span>Loading articles...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4 text-rose-500" />
                      <span>Load More Articles</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-neutral-400">
                  📰 You&apos;ve reached the end of the news catalog.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
