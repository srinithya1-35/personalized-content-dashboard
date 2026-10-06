'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import UnifiedFeed from '@/components/feed/UnifiedFeed';
import TrendingSection from '@/components/feed/TrendingSection';
import CategoryPills from '@/components/common/CategoryPills';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useAppSelector } from '@/hooks/useRedux';
import { Sparkles, SlidersHorizontal, Compass, Globe } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const profile = useAppSelector((state) => state.user.profile);
  const selectedCategories = useAppSelector(
    (state) => state.preferences.selectedCategories
  );

  const [greeting, setGreeting] = useState('Good day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning ☕');
    else if (hour < 18) setGreeting('Good afternoon 🌸');
    else setGreeting('Good evening 🌙');
  }, []);

  return (
    <AppShell>
      <div className="space-y-10 pb-12">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-cream-100 via-peach-50 to-lavender-50 dark:from-charcoal-900 dark:via-charcoal-850 dark:to-plum-950/70 border border-neutral-200/60 dark:border-neutral-800 shadow-soft">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-charcoal-800/80 text-lavender-700 dark:text-lavender-300 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-lavender-500" />
              <span>Personalized Sanctuary</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              {greeting}, {profile.name.split(' ')[0]}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Curated Indian cinema, classical melodies, cultural news, and artisan lifestyle moments tailored to your active passions 🪔✨
            </p>

            {/* Language Selector Bar */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-500" />
                <span>Content Language Preference</span>
              </div>
              <LanguageSelector variant="pills" />
            </div>

            {/* Quick Categories Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Active Interests ({selectedCategories.length})
                </span>
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-lavender-700 dark:text-lavender-400 hover:underline"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Customize</span>
                </Link>
              </div>
              <CategoryPills interactive={true} />
            </div>
          </div>

          {/* Decorative ambient gradient backdrop circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-lavender-300/20 dark:bg-plum-700/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 right-32 w-56 h-56 rounded-full bg-peach-300/20 dark:bg-peach-700/10 blur-3xl pointer-events-none" />
        </div>

        {/* Section 1: Trending Across All Realms */}
        <TrendingSection />

        {/* Section 2: Unified Personalized Discovery Feed with Reordering */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lavender-100 dark:bg-plum-900/60 text-lavender-600 dark:text-lavender-300 flex items-center justify-center shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                Your Unified Feed
              </h2>
              <p className="text-xs text-neutral-400">
                Interleaved discoveries matching your taste profile. Drag to organize.
              </p>
            </div>
          </div>

          <UnifiedFeed />
        </section>
      </div>
    </AppShell>
  );
}
