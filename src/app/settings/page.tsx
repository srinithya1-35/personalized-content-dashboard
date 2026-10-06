'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  ALL_CATEGORIES,
  toggleCategory,
  resetCategories,
  setFeedLayout,
  setLiveUpdatesEnabled,
  setAutoPlayAudioPreview,
} from '@/store/slices/preferencesSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import {
  Settings,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Moon,
  Sun,
  Radio,
  Volume2,
  LayoutGrid,
} from 'lucide-react';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector(
    (state) => state.preferences.selectedCategories
  );
  const feedLayout = useAppSelector((state) => state.preferences.feedLayout);
  const liveUpdatesEnabled = useAppSelector(
    (state) => state.preferences.liveUpdatesEnabled
  );
  const autoPlayAudioPreview = useAppSelector(
    (state) => state.preferences.autoPlayAudioPreview
  );
  const isDark = useAppSelector((state) => state.theme.isDark);

  const [notificationSaved, setNotificationSaved] = useState(false);

  const handleToggle = (catId: any) => {
    dispatch(toggleCategory(catId));
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 1500);
  };

  const handleReset = () => {
    dispatch(resetCategories());
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 1500);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-10 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/50 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-plum-900/60 text-lavender-600 dark:text-lavender-300 flex items-center justify-center shadow-soft">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Preferences &amp; Feed Customization
              </h1>
              <p className="text-xs text-neutral-400">
                Tailor your personal discovery algorithm. Changes are automatically saved to your browser session.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {notificationSaved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                <Check className="w-4 h-4" />
                <span>Saved live</span>
              </span>
            )}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-white/70 dark:bg-charcoal-800 hover:bg-neutral-100 dark:hover:bg-charcoal-700 transition-colors border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Section 1: Interests & Category Matrix */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <span>Select Content Realms</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-lavender-100 dark:bg-plum-900/40 text-lavender-700 dark:text-lavender-300">
                  {selectedCategories.length} Active
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Your unified feed and discovery streams adapt automatically to these active realms.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => handleToggle(cat.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-white dark:bg-charcoal-850 border-lavender-300 dark:border-plum-700 shadow-soft ring-2 ring-lavender-400/20'
                      : 'bg-white/40 dark:bg-charcoal-900/40 border-neutral-200/60 dark:border-neutral-800/80 hover:bg-white/70 dark:hover:bg-charcoal-850 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-1 rounded-xl bg-neutral-100 dark:bg-charcoal-800 shrink-0">
                      {cat.icon}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                        {cat.label}
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-tight">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-lavender-500 text-white shadow-xs'
                        : 'border border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Experience & Display Options */}
        <section className="space-y-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
            Interface &amp; Atmosphere
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Mode Card */}
            <div className="p-4 rounded-2xl glass-panel border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-plum-900/40 text-amber-600 dark:text-lavender-300 flex items-center justify-center">
                  {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
                    Theme Atmosphere
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {isDark ? 'Charcoal & Dark Plum mode' : 'Warm Cream & Lavender mode'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(toggleTheme())}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 transition-all shadow-sm"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Live Updates Simulation Card */}
            <div className="p-4 rounded-2xl glass-panel border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-peach-100 dark:bg-peach-950/40 text-peach-600 dark:text-peach-300 flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
                    Live Feed Pulses
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Periodic background update notifications
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(setLiveUpdatesEnabled(!liveUpdatesEnabled))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  liveUpdatesEnabled
                    ? 'bg-peach-500 text-white shadow-sm'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {liveUpdatesEnabled ? 'Active' : 'Off'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
