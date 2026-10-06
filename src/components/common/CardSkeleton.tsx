'use client';

import React from 'react';

interface CardSkeletonProps {
  type?: 'news' | 'movie' | 'music' | 'social' | 'default';
  count?: number;
}

export default function CardSkeleton({ type = 'default', count = 1 }: CardSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {skeletons.map((idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-2xl glass-panel p-4 shadow-soft animate-pulse flex flex-col justify-between"
          style={{ minHeight: type === 'movie' ? '380px' : type === 'news' ? '360px' : '300px' }}
        >
          {/* Image placeholder */}
          <div className="w-full h-44 rounded-xl bg-neutral-200/70 dark:bg-neutral-800/70 mb-4" />

          {/* Badge & Meta placeholder */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-20 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80" />
            <div className="h-4 w-14 rounded bg-neutral-200/60 dark:bg-neutral-800/60" />
          </div>

          {/* Title lines */}
          <div className="space-y-2 mb-3">
            <div className="h-5 w-5/6 rounded bg-neutral-300/80 dark:bg-neutral-700/80" />
            <div className="h-5 w-3/4 rounded bg-neutral-300/60 dark:bg-neutral-700/60" />
          </div>

          {/* Description lines */}
          <div className="space-y-1.5 mb-4">
            <div className="h-3.5 w-full rounded bg-neutral-200/70 dark:bg-neutral-800/70" />
            <div className="h-3.5 w-4/5 rounded bg-neutral-200/60 dark:bg-neutral-800/60" />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200/40 dark:border-neutral-800/50">
            <div className="h-8 w-24 rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80" />
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-neutral-200/70 dark:bg-neutral-800/70" />
              <div className="h-8 w-8 rounded-full bg-neutral-200/70 dark:bg-neutral-800/70" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
