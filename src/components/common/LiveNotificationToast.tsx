'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { insertLiveItem, setActiveModalItem } from '@/store/slices/contentSlice';
import { ContentItem } from '@/services/types';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LIVE_EVENTS_POOL: ContentItem[] = [
  {
    id: 'live-event-1',
    type: 'social',
    title: 'New wild clay glaze tests just cooled down!',
    description: 'Fresh out of the gas reduction kiln! The iron specks formed crystalline stars across the celadon surface 🌸',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
    category: 'art',
    language: 'en',
    author: {
      name: 'Aria Thorne',
      handle: '@aria_ceramics',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    },
    likes: 842,
    commentsCount: 39,
    hashtags: ['#wildclay', '#pottery', '#glazeporn'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'live-event-2',
    type: 'news',
    title: 'Solid-State Sodium Batteries Pass Final Pilot Scalability Test',
    description: 'Breakthrough testing results show 92% capacity retention after 3,000 rapid charge cycles at ambient temperatures.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200&auto=format&fit=crop',
    category: 'science',
    language: 'en',
    source: 'MIT Technology Review',
    author: 'Dr. Sarah Lin',
    readingTimeMinutes: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'live-event-3',
    type: 'music',
    title: 'Twilight Moss & Raindrops',
    description: 'Gentle ambient field recordings accompanied by delicate koto harp progressions for evening decompression.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    category: 'music',
    language: 'en',
    artist: 'Haruka Sato',
    album: 'Petals on Moss',
    duration: '3:40',
    moodTag: '🌸 Real-Time Drop',
    audioPreviewUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
    createdAt: new Date().toISOString(),
  },
];

export default function LiveNotificationToast() {
  const dispatch = useAppDispatch();
  const liveUpdatesEnabled = useAppSelector(
    (state) => state.preferences.liveUpdatesEnabled
  );
  const [activeNotification, setActiveNotification] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    // Send first simulated notification after 20 seconds, then every 60 seconds
    let index = 0;
    const initialTimer = setTimeout(() => {
      const event = LIVE_EVENTS_POOL[index % LIVE_EVENTS_POOL.length];
      setActiveNotification(event);
      index++;
    }, 20000);

    const interval = setInterval(() => {
      const event = LIVE_EVENTS_POOL[index % LIVE_EVENTS_POOL.length];
      setActiveNotification(event);
      index++;
    }, 65000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [liveUpdatesEnabled]);

  const handleDismiss = () => {
    setActiveNotification(null);
  };

  const handleInspect = () => {
    if (!activeNotification) return;
    dispatch(insertLiveItem(activeNotification));
    dispatch(setActiveModalItem(activeNotification));
    setActiveNotification(null);
  };

  if (!activeNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full"
      >
        <div className="rounded-2xl glass-dropdown p-4 shadow-soft-lg border border-lavender-300/40 dark:border-plum-700/60 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-peach-100 dark:bg-peach-950/50 text-peach-600 dark:text-peach-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 dark:text-rose-400">
                Live Update
              </span>
              <span className="text-[10px] text-neutral-400">• Just now</span>
            </div>
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate">
              {activeNotification.title}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
              {activeNotification.description}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleInspect}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-lavender-700 dark:text-lavender-300 hover:underline"
              >
                <span>View & Add to Feed</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
