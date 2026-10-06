# 🌸 AuraFeed — Personalized Content Discovery Platform
> **SDE Intern Frontend Assignment** — Production-Grade Web Application

A modern, aesthetic, and responsive personalized content dashboard built with **Next.js 14**, **React 18**, **TypeScript**, **Redux Toolkit**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Live Demo & Architecture Highlights

- **Visual Aesthetic:** Soft palette inspired by Kyoto botanicals, warm cream, soft lavender, dusty rose, and deep charcoal dark mode.
- **Unified Feed with Drag & Drop:** Buttery smooth card reordering powered by Framer Motion, persisted to `localStorage` via Redux Toolkit.
- **Multi-API Orchestration:** Curates **News** (editorial magazine glass layout), **Movies** (TMDB cinematic reels with 70mm styling), **Music** (Spotify/cozy lo-fi discovery with live audio preview player), and **Social** (lifestyle craft board: pottery, crafts, 35mm film, pets).
- **Debounced Global Search:** Instant modal search (`⌘K` / `Ctrl+K`) with 400ms debounce, grouping results by News, Movies, Music, and Social.
- **Resilient Fallback Architecture:** Works out-of-the-box offline or without API keys using high-fidelity curated data, while seamlessly connecting to live **NewsAPI**, **TMDB**, and **Apple iTunes / Spotify** when keys are supplied in `.env.local`.

---

## 📸 Core Features & Experiences

### 1. Unified Personalized Discovery Feed
- Interleaves content types (News, Movies, Music, Social) based on the user's active interests.
- **Interactive Drag & Drop:** Reorder cards effortlessly. The custom order persists across page refreshes.
- **Infinite Scrolling / Pagination:** Smooth "Load More" mechanism with skeleton loaders and duplicate-prevention deduplication.

### 2. Editorial Magazine News Experience
- Semi-transparent glassmorphism cards with large editorial imagery, reading time metrics, author bylines, and category tags.
- Direct modal reading and external publication link out.

### 3. Cinematic Film Strip / Movie Reel Experience
- 35mm / 70mm perforation borders, dark cinematic gradients, TMDB star ratings, release years, directors, and genre pills.

### 4. Cozy Music / Spotify-Style Discovery Experience
- Soft pastel aesthetics, cute recommendation tags (`🌸 Made for You`, `🐼 Panda Meadow`), album artwork, and an integrated **floating audio preview player** with playback scrubber, time tracker, and mute controls.

### 5. Aesthetic Social Discovery Board
- Lifestyle inspiration spanning pottery, slow crafts, floral design, 35mm film photography, and studio desks.
- Interactive likes with animated heart feedback and hashtag filters.

### 6. User Preferences & Settings
- Select from 12 distinct realms: *Technology, Movies, Music, Art, Lifestyle, Fitness, Travel, Fashion, Science, Finance, Sports, Pop Culture*.
- Instant persistence to browser `localStorage` through Redux Toolkit.
- Live feed update pulse simulator toggle (Section 31 Bonus).

### 7. Global Debounced Search
- Keyboard shortcut `⌘K` or `Ctrl+K`.
- 400ms input debounce to prevent redundant network invocations.
- Results segmented into 📰 News, 🎬 Movies, 🎵 Music, and 📱 Social.

### 8. Favorites Section
- Bookmarking across all 4 content types with quick filtering and one-click removal.

### 9. Atmosphere & Themes
- Seamless toggle between Warm Cream / Soft Lavender (Light Mode) and Deep Charcoal / Dark Plum (Dark Mode) using CSS variables and Tailwind's class strategy.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict Mode) |
| **State Management** | Redux Toolkit (`createSlice`, `createAsyncThunk`, typed hooks) |
| **Persistence** | SSR-safe LocalStorage Service |
| **Styling & Design System** | Tailwind CSS 3.4, CSS Custom Properties, Glassmorphism |
| **Animations & DnD** | Framer Motion 11 (`Reorder.Group`, `Reorder.Item`, `AnimatePresence`) |
| **Icons** | Lucide React |
| **Unit & Integration Tests** | Vitest, React Testing Library, JSDOM |
| **E2E Tests** | Playwright Test |

---

## 📁 Scalable Folder Structure

```text
personalized-content-dashboard/
├── e2e/                             # Playwright E2E test suites
│   └── dashboard.spec.ts
├── src/
│   ├── app/                         # Next.js App Router routes
│   │   ├── layout.tsx               # Root layout with metadata and providers
│   │   ├── page.tsx                 # Main dashboard (Greeting, Interests, Trending, Feed)
│   │   ├── providers.tsx            # Redux Provider, Theme sync, Modals, Audio player
│   │   ├── globals.css              # Custom CSS variables, scrollbar, glassmorphism
│   │   ├── favorites/page.tsx       # Favorites archive with type filtering
│   │   ├── trending/page.tsx        # Trending carousel and categorized rankings
│   │   ├── news/page.tsx            # Editorial magazine news layout
│   │   ├── movies/page.tsx          # Cinematic film strip catalog
│   │   ├── music/page.tsx           # Cozy music discovery and audio preview
│   │   ├── social/page.tsx          # Aesthetic lifestyle discovery board
│   │   └── settings/page.tsx        # 12-category matrix and preferences
│   ├── components/
│   │   ├── cards/                   # Specialized content cards
│   │   │   ├── NewsCard.tsx         # Editorial magazine card
│   │   │   ├── MovieCard.tsx        # Film-strip cinema reel card
│   │   │   ├── MusicCard.tsx        # Cozy pastel music card
│   │   │   ├── SocialCard.tsx       # Lifestyle craft post card
│   │   │   └── ContentCardWrapper.tsx # Polymorphic dispatcher
│   │   ├── common/                  # Reusable UI primitives
│   │   │   ├── Header.tsx           # Logo, debounced search bar, theme toggle, profile
│   │   │   ├── Sidebar.tsx          # Responsive navigation drawer & desktop sidebar
│   │   │   ├── AudioPlayer.tsx      # Floating bottom audio preview bar
│   │   │   ├── CardSkeleton.tsx     # Reusable shimmer loading skeletons
│   │   │   ├── DetailModal.tsx      # Rich content inspection modal
│   │   │   ├── EmptyState.tsx       # Aesthetic empty states with actions
│   │   │   ├── ErrorState.tsx       # Resilient error fallbacks with retry
│   │   │   ├── CategoryPills.tsx    # Interactive interest selector pills
│   │   │   ├── LiveNotificationToast.tsx # Real-time simulation toaster
│   │   │   ├── ProfileModal.tsx     # User profile & mock auth modal
│   │   │   └── SearchModal.tsx      # Global debounced search dialog (⌘K)
│   │   ├── feed/
│   │   │   ├── UnifiedFeed.tsx      # Framer Motion drag & drop reorderable feed
│   │   │   └── TrendingSection.tsx  # Horizontal scrollable carousel
│   │   └── layout/
│   │       └── AppShell.tsx         # Layout wrapper
│   ├── hooks/
│   │   ├── useDebounce.ts           # Debounce hook for input throttling
│   │   └── useRedux.ts              # Typed useAppDispatch & useAppSelector
│   ├── mock/                        # High-quality fallback datasets
│   │   ├── newsData.ts
│   │   ├── movieData.ts
│   │   ├── musicData.ts
│   │   └── socialData.ts
│   ├── services/                    # API integration and data transformation layer
│   │   ├── types.ts                 # Unified ContentItem interfaces
│   │   ├── storageService.ts        # SSR-safe local storage abstraction
│   │   ├── newsService.ts           # NewsAPI integration + fallback
│   │   ├── movieService.ts          # TMDB integration + fallback
│   │   ├── musicService.ts          # Apple iTunes live API + fallback
│   │   └── socialService.ts         # Social feed service
│   └── store/                       # Redux Toolkit modular architecture
│       ├── index.ts                 # Store configuration
│       └── slices/
│           ├── preferencesSlice.ts  # Selected categories & persistence
│           ├── favoritesSlice.ts    # User favorites & persistence
│           ├── feedOrderSlice.ts    # Custom drag-and-drop order & persistence
│           ├── themeSlice.ts        # Light / Dark theme & persistence
│           ├── searchSlice.ts       # Global debounced search thunks & results
│           ├── contentSlice.ts      # Multi-section content & audio playback
│           └── userSlice.ts         # User profile & mock authentication
├── .env.example                     # Environment variables template
├── .env.local                       # Local environment configuration (git ignored)
├── package.json
├── playwright.config.ts             # E2E test configuration
├── tailwind.config.ts               # Custom aesthetic color palette
└── vitest.config.ts                 # Unit & integration test configuration
```

---

## 🔌 API Configuration & Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default / Fallback Behavior |
|---|---|---|
| `NEXT_PUBLIC_NEWS_API_KEY` | Key from [NewsAPI.org](https://newsapi.org) | When empty, serves curated editorial stories |
| `NEXT_PUBLIC_NEWS_API_URL` | Base endpoint for NewsAPI | `https://newsapi.org/v2` |
| `NEXT_PUBLIC_TMDB_API_KEY` | API Key from [TMDB](https://www.themoviedb.org) | When empty, serves curated 70mm cinema reels |
| `NEXT_PUBLIC_TMDB_BASE_URL`| TMDB Base URL | `https://api.themoviedb.org/3` |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`| Optional Spotify Client ID | Real audio previews via Apple iTunes API + fallback |
| `NEXT_PUBLIC_ENABLE_REALTIME_SIMULATION`| Simulates live background feed updates | `true` |

> **Security Note:** `.env.local` is listed in `.gitignore`. No private keys are hardcoded in the codebase.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.17+` (v20+ or v22+ recommended)
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Testing Suite

### 1. Unit & Integration Tests (Vitest + React Testing Library)

```bash
npm test
```

Executes 21 unit and integration test cases across 7 suites covering:
- Category toggling, defaults, and persistence logic (`preferencesSlice.test.ts`)
- Favoriting, un-favoriting, and filter reducer logic (`favoritesSlice.test.ts`)
- Theme mode switching (`themeSlice.test.ts`)
- Rapid keystroke debounce delay handling (`useDebounce.test.ts`)
- Content card rendering: News, Movie, Music, Social (`cards.test.tsx`)
- Asynchronous API fetching -> Redux state -> Unified Feed DOM rendering (`feedFlow.test.tsx`)
- Global Search modal execution and multi-realm result grouping (`searchFlow.test.tsx`)

### 2. End-to-End Tests (Playwright)

```bash
npm run test:e2e
```

Validates real-user flows including:
1. Landing page layout, headers, interests, and feed rendering
2. Global debounced search (`⌘K`) with live query execution
3. Favoriting an item and inspecting it in the `/favorites` route
4. Customizing interest categories in the `/settings` route

---

## 🏗️ Production Build

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🌐 Evaluation Criteria Fulfillment

- **Functionality:** Complete coverage of news, movies, music, social, preferences, drag-and-drop, debounced search, favorites, trending, dark mode.
- **Code Quality:** Strictly typed TypeScript, clean modular slices, reusable components, zero console warnings.
- **UI/UX Design:** Bespoke aesthetic palette (Warm Cream, Lavender, Dusty Rose, Charcoal), smooth Framer Motion transitions, responsive drawer navigation.
- **State Management:** Redux Toolkit slices with thunks, typed selectors, and SSR-safe persistence.
- **Performance:** Debounced search inputs, paginated data loading, static prerendering, and optimized Next.js image loading.
- **Security:** Secret keys externalized to `.env.local` with comprehensive `.gitignore` protection.
