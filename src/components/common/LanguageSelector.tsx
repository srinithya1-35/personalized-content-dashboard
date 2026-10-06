'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setLanguage } from '@/store/slices/preferencesSlice';
import { fetchUnifiedFeed } from '@/store/slices/contentSlice';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/services/types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'pills';
  className?: string;
}

export default function LanguageSelector({ variant = 'dropdown', className = '' }: LanguageSelectorProps) {
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector((state) => state.preferences.selectedLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const activeOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: SupportedLanguage) => {
    dispatch(setLanguage(lang));
    dispatch(fetchUnifiedFeed({ page: 1, refresh: true }));
    setIsOpen(false);
  };

  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white/70 dark:bg-charcoal-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Content Language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-100/90 dark:bg-charcoal-800 border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-200 hover:border-lavender-300 dark:hover:border-plum-700 transition-all text-xs font-semibold shadow-2xs"
      >
        <Globe className="w-3.5 h-3.5 text-lavender-600 dark:text-lavender-400 shrink-0" />
        <span className="hidden sm:inline">{activeOption.nativeLabel}</span>
        <span className="sm:hidden">{activeOption.code.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-dropdown p-2 shadow-soft-lg bg-white/95 dark:bg-charcoal-900/95 border border-neutral-200 dark:border-neutral-800 z-50 animate-fade-in">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 mb-1">
            Language Preference
          </div>
          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-lavender-100 dark:bg-plum-900/50 text-lavender-800 dark:text-lavender-200 font-bold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-charcoal-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeLabel}</span>
                    {lang.code !== 'all' && (
                      <span className="text-[10px] text-neutral-400">({lang.label})</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-lavender-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
