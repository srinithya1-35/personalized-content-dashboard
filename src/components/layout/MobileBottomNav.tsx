'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Film, Music, Share2, Newspaper } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Feed', href: '/', icon: Compass },
    { name: 'Cinema', href: '/movies', icon: Film },
    { name: 'Music', href: '/music', icon: Music },
    { name: 'Social', href: '/social', icon: Share2 },
    { name: 'News', href: '/news', icon: Newspaper },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-charcoal-900/95 backdrop-blur-xl border-t border-neutral-200/70 dark:border-neutral-800/80 px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-soft-lg transition-colors duration-300"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
