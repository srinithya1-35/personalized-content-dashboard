'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleCategory, ALL_CATEGORIES } from '@/store/slices/preferencesSlice';
import { Category } from '@/services/types';
import { motion } from 'framer-motion';

interface CategoryPillsProps {
  interactive?: boolean;
  selectedCategory?: string;
  onSelect?: (cat: string) => void;
  showAllOption?: boolean;
}

export default function CategoryPills({
  interactive = true,
  selectedCategory,
  onSelect,
  showAllOption = false,
}: CategoryPillsProps) {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector(
    (state) => state.preferences.selectedCategories
  );

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
      {showAllOption && onSelect && (
        <button
          onClick={() => onSelect('all')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-charcoal-700'
          }`}
        >
          ✨ All Realms
        </button>
      )}

      {ALL_CATEGORIES.map((cat) => {
        const isSelected = onSelect
          ? selectedCategory === cat.id
          : selectedCategories.includes(cat.id);

        return (
          <button
            key={cat.id}
            onClick={() => {
              if (onSelect) {
                onSelect(cat.id);
              } else if (interactive) {
                dispatch(toggleCategory(cat.id));
              }
            }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 ${
              isSelected
                ? 'bg-lavender-500 text-white shadow-lavender-200 dark:shadow-none'
                : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-charcoal-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
