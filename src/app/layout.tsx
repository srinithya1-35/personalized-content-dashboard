import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'AuraFeed — Personalized Content Discovery',
  description: 'A modern, aesthetic lifestyle dashboard curating news, cinema reels, cozy music, and creative social posts tailored to your personal tastes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-lavender-200 selection:text-neutral-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
