'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setCurrentlyPlayingTrack, setIsPlayingAudio } from '@/store/slices/contentSlice';
import { Play, Pause, X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioPlayer() {
  const dispatch = useAppDispatch();
  const track = useAppSelector((state) => state.content.currentlyPlayingTrack);
  const isPlaying = useAppSelector((state) => state.content.isPlayingAudio);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (track && track.audioPreviewUrl) {
      if (audioRef.current) {
        audioRef.current.src = track.audioPreviewUrl;
        audioRef.current.play().then(() => {
          dispatch(setIsPlayingAudio(true));
        }).catch((err) => {
          console.warn('[AudioPlayer] Playback blocked or source unavailable:', err);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [track, dispatch]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(setIsPlayingAudio(false));
    } else {
      audioRef.current.play().then(() => {
        dispatch(setIsPlayingAudio(true));
      }).catch((e) => console.warn(e));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    dispatch(setIsPlayingAudio(false));
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    dispatch(setCurrentlyPlayingTrack(null));
    dispatch(setIsPlayingAudio(false));
  };

  if (!track) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl"
      >
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={() => console.warn('[AudioPlayer] Audio playback error')}
        />

        <div className="relative overflow-hidden rounded-2xl glass-dropdown p-3.5 shadow-soft-lg border border-lavender-300/40 dark:border-plum-800/80 bg-white/90 dark:bg-charcoal-900/95 backdrop-blur-xl">
          {/* Subtle gradient glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-peach-300 via-rose-300 to-lavender-400 dark:from-peach-500 dark:via-rose-500 dark:to-lavender-500" />

          <div className="flex items-center gap-3">
            {/* Artwork thumbnail */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-black/5">
              <img
                src={track.image}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 bg-white rounded-full animate-bounce h-2" />
                    <span className="w-1 bg-white rounded-full animate-bounce h-3 delay-75" />
                    <span className="w-1 bg-white rounded-full animate-bounce h-1.5 delay-150" />
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-peach-100 text-peach-700 dark:bg-plum-900/60 dark:text-peach-300 font-medium shrink-0">
                  {track.moodTag || '🌸 Preview'}
                </span>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                  {track.title}
                </p>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {track.artist} • {track.album}
              </p>

              {/* Progress Slider */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-neutral-400 font-mono w-6 text-right">
                  {Math.floor(currentTime)}s
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 30}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Audio progress slider"
                  className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-lavender-500"
                />
                <span className="text-[10px] text-neutral-400 font-mono w-6">
                  {Math.floor(duration || 30)}s
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                className="w-9 h-9 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleClose}
                aria-label="Close audio player"
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
