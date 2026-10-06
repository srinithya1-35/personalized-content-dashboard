'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Send, Plus, Sparkles } from 'lucide-react';
import { useAppSelector } from '@/hooks/useRedux';

export interface StoryItem {
  id: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  location: string;
  timeAgo: string;
  mediaUrl: string;
  caption: string;
  hasViewed?: boolean;
}

const INDIAN_STORIES: StoryItem[] = [
  {
    id: 'story-1',
    creatorName: 'Sathyabhama',
    creatorHandle: '@sathyabhama.creative',
    creatorAvatar: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300&auto=format&fit=crop',
    location: 'Mylapore, Chennai',
    timeAgo: '2h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    caption: 'Dawn kolam and fresh Madurai jasmine flowers ready for morning prayers 🪔🌸',
  },
  {
    id: 'story-2',
    creatorName: 'Malleshwaram Filter Coffee',
    creatorHandle: '@satvika_bengaluru',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    location: 'Malleshwaram 8th Cross',
    timeAgo: '3h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    caption: 'Freshly roasted Chicory blend bubbling in brass davaras this morning ☕✨',
  },
  {
    id: 'story-3',
    creatorName: 'Channapatna Woodcraft',
    creatorHandle: '@channapatna_crafts',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    location: 'Channapatna Toy Village',
    timeAgo: '4h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
    caption: 'Turning natural lac and turmeric vegetable dyes onto Wrightia tinctoria wood 🪵🎨',
  },
  {
    id: 'story-4',
    creatorName: 'Kashi Ganga Aarti',
    creatorHandle: '@kashi_darshan',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    location: 'Dashashwamedh Ghat, Varanasi',
    timeAgo: '5h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    caption: 'Brass lamps igniting the holy Ganges as conch shells resonate across Kashi 🪔🌊',
  },
  {
    id: 'story-5',
    creatorName: 'Kuchipudi Studio',
    creatorHandle: '@lavanya_kuchipudi',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    location: 'Krishna District, AP',
    timeAgo: '6h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    caption: 'Tarangam brass plate practice with ghungroos this evening 💃✨',
  },
  {
    id: 'story-6',
    creatorName: 'Mysore Silk Loom',
    creatorHandle: '@meera_weaves',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    location: 'Mysuru Weavers Guild',
    timeAgo: '7h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
    caption: 'Gold zari pure mulberry silk rolling off the heritage pit loom 🥻🦚',
  },
  {
    id: 'story-7',
    creatorName: 'Araku Valley Coffee',
    creatorHandle: '@araku_explorer',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    location: 'Eastern Ghats, AP',
    timeAgo: '8h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
    caption: 'Morning mist rolling over tribal organic coffee plantations 🌿☕',
  },
  {
    id: 'story-8',
    creatorName: 'Hampi Sunset Ruins',
    creatorHandle: '@vidya_hampi',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    location: 'Vijayanagara, Karnataka',
    timeAgo: '9h ago',
    mediaUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    caption: 'Golden hour lights up the monolithic Stone Chariot at Vittala Temple 🛕🌅',
  },
];

export default function InstagramStoriesTray() {
  const profile = useAppSelector((state) => state.user.profile);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  const stories = INDIAN_STORIES;

  // Auto-advance progress timer when story is open
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story or close
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex((idx) => (idx !== null ? idx + 1 : null));
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2; // ~5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, isPaused, stories.length]);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setProgress(0);
    setReplySent(false);
    setReplyText('');
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setProgress(0);
    setReplySent(false);
  };

  const handleNext = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
      setReplySent(false);
    } else {
      closeStory();
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
      setReplySent(false);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText('');
    setTimeout(() => setReplySent(false), 2000);
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <>
      {/* Horizontal Stories Tray */}
      <div className="relative py-2.5 sm:py-3 px-1 border-b border-neutral-200/60 dark:border-neutral-800 bg-white/50 dark:bg-charcoal-900/50 backdrop-blur-md rounded-2xl sm:rounded-3xl">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-2 sm:px-3">
          {/* Your Story (Sathyabhama) */}
          <button
            onClick={() => openStory(0)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] sm:p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-white dark:bg-charcoal-900">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-sage-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-charcoal-900 shadow-sm">
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-700 dark:text-neutral-200 truncate max-w-[64px] sm:max-w-[72px]">
              Your Story
            </span>
          </button>

          {/* Indian Cultural Creators Stories */}
          {stories.slice(1).map((story, idx) => {
            const actualIndex = idx + 1;
            return (
              <button
                key={story.id}
                onClick={() => openStory(actualIndex)}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] sm:p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-white dark:bg-charcoal-900">
                    <img
                      src={story.creatorAvatar}
                      alt={story.creatorName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[76px] text-center">
                  {story.creatorName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instagram Story Fullscreen Viewer Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
          >
            {/* Outer relative wrapper for navigation arrows */}
            <div className="relative flex items-center justify-center">
              {/* Desktop Prev Navigation Arrow */}
              {activeStoryIndex! > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Story Container (Phone Aspect Ratio) */}
              <div
                className="relative w-full max-w-sm h-[85vh] max-h-[780px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
              {/* Background Media */}
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.caption}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

              {/* Progress Bar Header */}
              <div className="relative z-10 p-3 pt-4 space-y-2.5">
                <div className="flex gap-1.5 w-full">
                  {stories.map((s, idx) => (
                    <div
                      key={s.id}
                      className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{
                          width:
                            idx < activeStoryIndex!
                              ? '100%'
                              : idx === activeStoryIndex
                              ? `${progress}%`
                              : '0%',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Author Info & Close */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeStory.creatorAvatar}
                      alt={activeStory.creatorName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold leading-none">
                          {activeStory.creatorName}
                        </span>
                        <span className="text-[10px] text-white/70 leading-none">
                          • {activeStory.timeAgo}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/80 leading-none pt-0.5">
                        📍 {activeStory.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={closeStory}
                    className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tap Left / Right Hotspots for Navigation */}
              <div className="absolute inset-0 flex z-0">
                <div
                  className="w-1/3 h-full cursor-pointer"
                  onClick={handlePrev}
                  aria-label="Previous story"
                />
                <div
                  className="w-2/3 h-full cursor-pointer"
                  onClick={handleNext}
                  aria-label="Next story"
                />
              </div>

              {/* Story Caption & Interactive Reply Bar */}
              <div className="relative z-10 p-4 space-y-3">
                <p className="text-sm font-medium text-white drop-shadow-md leading-snug">
                  {activeStory.caption}
                </p>

                {replySent ? (
                  <div className="py-2.5 px-4 rounded-full bg-emerald-500/90 text-white text-xs font-semibold text-center backdrop-blur-md">
                    Reply sent to {activeStory.creatorHandle}! ✨
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${activeStory.creatorName.split(' ')[0]}...`}
                      className="flex-1 bg-white/20 text-white placeholder-white/70 text-xs px-4 py-2.5 rounded-full border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/80"
                    />
                    <div className="flex items-center gap-1">
                      {['❤️', '🔥', '🪔'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setReplyText((prev) => prev + emoji)}
                          className="text-base hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                      <button
                        type="submit"
                        className="p-2 rounded-full bg-white/30 hover:bg-white text-black transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              </div>

              {/* Desktop Next Navigation Arrow */}
              {activeStoryIndex! < stories.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
