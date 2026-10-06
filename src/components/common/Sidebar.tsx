'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/useRedux';
import {
  Compass,
  Flame,
  Heart,
  Newspaper,
  Film,
  Music,
  Share2,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);

  const navigation = [
    { name: 'Personalized Feed', href: '/', icon: Compass, badge: null },
    { name: 'Trending Now', href: '/trending', icon: Flame, badge: 'Hot' },
    { name: 'Your Favorites', href: '/favorites', icon: Heart, badge: favoritesCount > 0 ? String(favoritesCount) : null },
    { name: 'Editorial News', href: '/news', icon: Newspaper, badge: null },
    { name: 'Cinema Reels', href: '/movies', icon: Film, badge: null },
    { name: 'Cozy Music', href: '/music', icon: Music, badge: 'Lo-Fi' },
    { name: 'Social Discovery', href: '/social', icon: Share2, badge: null },
    { name: 'Preferences', href: '/settings', icon: Settings, badge: null },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between py-6 px-4">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-lavender-100 text-lavender-800 dark:bg-plum-900/60 dark:text-lavender-200 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/70 dark:hover:bg-charcoal-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-lavender-600 dark:text-lavender-300'
                        : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badge === 'Hot'
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-lavender-200 text-lavender-700 dark:bg-plum-800 dark:text-lavender-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Aesthetic Card / Tip */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-peach-50 to-lavender-50 dark:from-charcoal-850 dark:to-plum-950/70 border border-peach-200/40 dark:border-plum-900/50 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
          <Sparkles className="w-3.5 h-3.5 text-peach-500" />
          <span>Curated For You</span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Your dashboard adapts live to categories selected in Preferences. Drag cards to personalize order.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-neutral-200/50 dark:border-neutral-800/80 bg-white/50 dark:bg-charcoal-900/50 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-charcoal-900 h-full shadow-2xl flex flex-col z-10 border-r border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
              <span className="font-bold text-sm tracking-tight gradient-text-aura">
                AuraFeed Navigation
              </span>
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}
