'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleTheme } from '@/store/slices/themeSlice';
import { setSearchModalOpen } from '@/store/slices/searchSlice';
import { setProfileModalOpen } from '@/store/slices/userSlice';
import LanguageSelector from './LanguageSelector';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Menu,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const profile = useAppSelector((state) => state.user.profile);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-neutral-200/50 dark:border-neutral-800 bg-white/75 dark:bg-charcoal-900/75 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            aria-label="Open navigation sidebar"
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-lavender-400 via-rose-300 to-peach-300 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base tracking-tight gradient-text-aura">
                AuraFeed
              </span>
              <span className="text-[10px] text-neutral-400 font-medium -mt-1 hidden sm:inline">
                Personalized Discovery
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-1 sm:mx-4 min-w-0">
          <button
            onClick={() => dispatch(setSearchModalOpen(true))}
            className="w-full flex items-center justify-between px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-neutral-100/80 dark:bg-charcoal-800 border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-lavender-300 dark:hover:border-plum-700 transition-all shadow-sm text-xs group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-neutral-400 group-hover:text-lavender-500 transition-colors shrink-0" />
              <span className="hidden md:inline truncate">Search news, cinema, music, stories...</span>
              <span className="md:hidden truncate">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-charcoal-900 text-neutral-500 border border-neutral-200 dark:border-neutral-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions (Language, Theme, Favorites counter, Notification, Profile) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* Quick link to Favorites with Counter */}
          <Link
            href="/favorites"
            aria-label="View favorites"
            className="relative p-1.5 sm:p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 sm:p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-lavender-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Dropdown Toggle (Hidden on extra small mobile screens) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              aria-label="Notifications"
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-peach-500" />
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-dropdown p-3 shadow-soft-lg bg-white/95 dark:bg-charcoal-900/95 border border-neutral-200 dark:border-neutral-800 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-100">
                  <span>Activity Feed</span>
                  <span className="text-[10px] text-peach-500">Live</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-peach-50/60 dark:bg-peach-950/30 text-neutral-700 dark:text-neutral-300">
                    <p className="font-medium text-[11px] text-peach-700 dark:text-peach-300">
                      🌸 Made For You
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Added &quot;Singara Siriye&quot; to regional music.
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-lavender-50/60 dark:bg-plum-950/30 text-neutral-700 dark:text-neutral-300">
                    <p className="font-medium text-[11px] text-lavender-700 dark:text-lavender-300">
                      🎬 Cinema Trend
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Kantara &amp; RRR available with full descriptions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => dispatch(setProfileModalOpen(true))}
            aria-label="Open user profile settings"
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1 border border-neutral-200/50 dark:border-neutral-700/50"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-lavender-400">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 pr-1.5 hidden lg:inline">
              {profile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
