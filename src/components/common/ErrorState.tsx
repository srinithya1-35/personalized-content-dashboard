'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Unable to load content',
  message = 'We encountered a momentary issue while gathering your personalized recommendations. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-3xl glass-panel my-8 border border-rose-200/50 dark:border-rose-900/30 max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-500 dark:text-rose-300 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-white transition-all shadow-sm active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
