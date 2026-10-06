'use client';

import React, { useState, useRef } from 'react';
import { SocialContentItem, SocialComment } from '@/services/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { setActiveModalItem } from '@/store/slices/contentSlice';
import { socialService } from '@/services/socialService';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MapPin,
  MoreHorizontal,
  Smile,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialCardProps {
  item: SocialContentItem;
  variant?: 'feed' | 'grid';
}

export default function SocialCard({ item, variant = 'feed' }: SocialCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const profile = useAppSelector((state) => state.user.profile);
  const isFavorited = favorites.some((f) => f.id === item.id);

  const [likes, setLikes] = useState(item.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  // Comments state
  const [comments, setComments] = useState<SocialComment[]>(item.commentsList || []);
  const [showAllComments, setShowAllComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Double-tap detection
  const lastTapRef = useRef<number>(0);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleLike = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      await socialService.toggleLike(item.id);
    } else {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    }
  };

  const handleImageDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY || e.detail === 2) {
      // Trigger heart pop
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);

      if (!hasLiked) {
        handleLike();
      }
    }
    lastTapRef.current = now;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = item.url || (typeof window !== 'undefined' ? window.location.href : '');
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Post link copied to clipboard! 🌸');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const added = await socialService.addComment(item.id, {
      author: profile.name,
      handle: profile.handle,
      text: newCommentText.trim(),
    });

    if (added) {
      setComments((prev) => [...prev, added]);
      setNewCommentText('');
      setShowAllComments(true);
    }
    setIsSubmittingComment(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setNewCommentText((prev) => prev + emoji);
    commentInputRef.current?.focus();
  };

  // If in Grid view (Instagram Explore style)
  if (variant === 'grid') {
    return (
      <div
        onClick={() => dispatch(setActiveModalItem(item))}
        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-800"
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Instagram Explore Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-bold text-sm">
          <div className="flex items-center gap-1.5">
            <Heart className="w-5 h-5 fill-white" />
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>{comments.length || item.commentsCount}</span>
          </div>
        </div>
      </div>
    );
  }

  // Instagram Feed View (Default)
  return (
    <article className="relative bg-white dark:bg-charcoal-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-soft transition-all duration-300">
      {/* 1. Header: Author Info & Location */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-neutral-100 dark:border-neutral-800/60">
        <div className="flex items-center gap-3">
          {/* Instagram Gradient Ring around Avatar */}
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-charcoal-900 p-0.5">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-50 truncate">
                {item.author.name}
              </span>
              <span className="text-[11px] text-neutral-400 font-mono truncate">
                {item.author.handle}
              </span>
            </div>

            {item.location && (
              <p className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span>{item.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Badges & Options */}
        <div className="flex items-center gap-2">
          {item.language && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 dark:bg-charcoal-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
              {item.language}
            </span>
          )}
          <button
            onClick={handleShare}
            aria-label="Post options"
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Media Image with Double-Tap Heart Interaction */}
      <div
        onClick={handleImageDoubleTap}
        className="relative aspect-square sm:aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800 select-none cursor-pointer overflow-hidden"
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {/* Category Pill Overlay */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md uppercase tracking-wider">
            {item.category}
          </span>
        </div>

        {/* Big Double-Tap Heart Animation */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-24 h-24 text-white fill-rose-500 drop-shadow-2xl stroke-white stroke-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Action Icons Bar */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            aria-label={hasLiked ? 'Unlike' : 'Like'}
            className="transition-transform active:scale-75 focus:outline-none"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                hasLiked
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-neutral-800 dark:text-neutral-100 hover:text-neutral-500'
              }`}
            />
          </button>

          {/* Comment */}
          <button
            onClick={() => commentInputRef.current?.focus()}
            aria-label="Comment"
            className="text-neutral-800 dark:text-neutral-100 hover:text-neutral-500 transition-colors focus:outline-none"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Share"
            className="text-neutral-800 dark:text-neutral-100 hover:text-neutral-500 transition-colors focus:outline-none"
          >
            <Send className="w-5 h-5 -rotate-12" />
          </button>
        </div>

        {/* Save / Bookmark */}
        <button
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from saved' : 'Save post'}
          className="transition-transform active:scale-75 focus:outline-none"
        >
          <Bookmark
            className={`w-6 h-6 ${
              isFavorited
                ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white'
                : 'text-neutral-800 dark:text-neutral-100 hover:text-neutral-500'
            }`}
          />
        </button>
      </div>

      {/* 4. Likes Counter */}
      <div className="px-4 pt-2">
        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
          Liked by <span className="font-semibold text-neutral-700 dark:text-neutral-300">raghav_arts</span> and{' '}
          <span>{likes.toLocaleString()} others</span>
        </p>
      </div>

      {/* 5. Title & Caption */}
      <div className="px-4 pt-1.5 space-y-1">
        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
          {item.title}
        </h4>
        <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
          <span className="font-bold mr-1.5 text-neutral-900 dark:text-neutral-100">
            {item.author.handle.replace('@', '')}
          </span>
          {isCaptionExpanded ? item.description : item.description.slice(0, 110)}
          {item.description.length > 110 && !isCaptionExpanded && (
            <button
              onClick={() => setIsCaptionExpanded(true)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 ml-1 text-xs font-medium"
            >
              ...more
            </button>
          )}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 6. Comments Section */}
      <div className="px-4 pt-2 space-y-1.5">
        {comments.length > 1 && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 font-medium"
          >
            {showAllComments
              ? 'Hide comments'
              : `View all ${comments.length || item.commentsCount} comments`}
          </button>
        )}

        {/* Comments Preview */}
        <div className="space-y-1 pt-0.5">
          {(showAllComments ? comments : comments.slice(0, 1)).map((c) => (
            <div key={c.id} className="text-xs text-neutral-700 dark:text-neutral-300 leading-snug">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 mr-1.5">
                {c.author}
              </span>
              <span>{c.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Inline Comment Box (Instagram style) */}
      <form
        onSubmit={handleAddComment}
        className="mt-3 px-4 py-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-2.5 bg-neutral-50/50 dark:bg-charcoal-900/50"
      >
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-neutral-300 dark:ring-neutral-700"
        />

        <input
          ref={commentInputRef}
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={`Add a comment as ${profile.name.split(' ')[0]}...`}
          className="flex-1 bg-transparent text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
        />

        {/* Quick Emojis */}
        <div className="hidden sm:flex items-center gap-1 text-sm text-neutral-400">
          {['❤️', '🔥', '🪔', '✨'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!newCommentText.trim() || isSubmittingComment}
          className={`text-xs font-bold transition-colors ${
            newCommentText.trim()
              ? 'text-rose-600 dark:text-rose-400 hover:text-rose-700'
              : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
          }`}
        >
          Post
        </button>
      </form>
    </article>
  );
}
