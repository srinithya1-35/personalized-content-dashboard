'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppSelector } from '@/hooks/useRedux';
import AudioPlayer from '@/components/common/AudioPlayer';
import DetailModal from '@/components/common/DetailModal';
import ProfileModal from '@/components/common/ProfileModal';
import LiveNotificationToast from '@/components/common/LiveNotificationToast';
import SearchModal from '@/components/common/SearchModal';

function ThemeSync({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {children}
      <AudioPlayer />
      <DetailModal />
      <ProfileModal />
      <LiveNotificationToast />
      <SearchModal />
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeSync>{children}</ThemeSync>
    </Provider>
  );
}
