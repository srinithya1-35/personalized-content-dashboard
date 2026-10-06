'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { updateProfile, toggleLogin, setProfileModalOpen } from '@/store/slices/userSlice';
import { X, User, Check, LogIn, LogOut, Sparkles, Heart, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.user.isProfileModalOpen);
  const profile = useAppSelector((state) => state.user.profile);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);

  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setHandle(profile.handle);
      setBio(profile.bio);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, handle, bio }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setProfileModalOpen(false))}
          className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-charcoal-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-lavender-100 dark:bg-plum-900/40 text-lavender-600 dark:text-lavender-300">
                <User className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                  Profile & Account
                </h3>
                <p className="text-xs text-neutral-400">
                  Manage your public persona & feed persona
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(setProfileModalOpen(false))}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center my-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md ring-4 ring-lavender-200 dark:ring-plum-800 mb-3">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-100 text-base">
              {profile.name}
            </h4>
            <p className="text-xs text-lavender-600 dark:text-lavender-400 font-mono">
              {profile.handle}
            </p>

            {/* Quick stats */}
            <div className="flex gap-6 mt-4 py-2 px-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/40 text-center">
              <div>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                  {favoritesCount}
                </p>
                <p className="text-[10px] text-neutral-400">Saved Favorites</p>
              </div>
              <div className="w-[1px] bg-neutral-200 dark:bg-neutral-700" />
              <div>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                  {profile.isLoggedIn ? 'Active' : 'Guest'}
                </p>
                <p className="text-[10px] text-neutral-400">Status</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-lavender-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Username / Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-lavender-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-lavender-400 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => dispatch(toggleLogin())}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {profile.isLoggedIn ? (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Mock Log Out</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Mock Log In</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-all shadow-sm"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
