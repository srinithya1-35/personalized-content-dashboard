'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl glass-panel my-8 border border-neutral-200/50 dark:border-neutral-800/60 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-lavender-100 dark:bg-plum-900/50 text-lavender-600 dark:text-lavender-300 flex items-center justify-center mb-5 shadow-soft">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionText && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
