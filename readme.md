# MovieBites Mobile App - Frontend Development Prompt

## Project Overview
Create a **subscription-based video streaming mobile application** (similar to Netflix/TikTok for short-form content) using **React Native with Expo, NativeWind (Tailwind CSS), and TypeScript**. The app will consume a RESTful API backend for managing webseries (movies, shows, shorts/reels), user authentication, favorites, likes, and subscriptions.

---

## Tech Stack Requirements

### Core Technologies
- **Framework**: React Native with Expo (latest SDK)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand or React Query (TanStack Query)
- **Navigation**: Expo Router (file-based routing)
- **Video Player**: expo-av or react-native-video with HLS support
- **Authentication**: Expo AuthSession (for social login) + AsyncStorage
- **HTTP Client**: Axios with interceptors
- **Form Validation**: Zod
- **Icons**: @expo/vector-icons or lucide-react-native

### Additional Libraries
- **Image Handling**: expo-image (optimized image component)
- **Gestures**: react-native-gesture-handler
- **Animations**: react-native-reanimated
- **Bottom Sheets**: @gorhom/bottom-sheet
- **Toast Notifications**: react-native-toast-message
- **Pull to Refresh**: Built-in FlatList/ScrollView
- **Skeleton Loading**: Custom components with NativeWind

---

## API Backend Documentation

### Base URL

Production API URL: https://moviebites-api.rishi-300.workers.dev/


### ENV

EXPO_PUBLIC_API_URL=https://moviebites-api.rishi-300.workers.dev

### Authentication
- **Mobile API Key**: implement simple username and password authentication and store in db (store password in token fields in db)
- **User Identification**: `social_id`, `email`, or `udid` (device identifier)
- **No JWT required** for mobile users (simplified auth)
- **Social Authentication**: no social auth now , later we use best-auth

## App Architecture & Features

### 1. **App Structure (Expo Router)**

```
app/
├── (auth)/
│   ├── login.tsx
│   ├── signup.tsx
│   └── onboarding.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx          # Home/Feed
│   ├── explore.tsx        # Browse/Search
│   ├── favorites.tsx      # User's favorites
│   └── profile.tsx        # User profile
├── (modals)/
│   ├── video-player.tsx   # Full-screen video player
│   ├── subscription.tsx   # Subscription plans
│   └── filters.tsx        # Filter bottom sheet
├── webseries/
│   └── [id].tsx           # WebSeries detail page
├── category/
│   └── [slug].tsx         # Category listing
├── search.tsx             # Search results
├── settings.tsx
├── _layout.tsx            # Root layout
└── +not-found.tsx
```

---

### 2. **Core Features**

#### A. **Home Screen (Feed)**
- **Hero Banner**: Display `display-on-banner` tagged content (carousel)
- **Horizontal Scrollable Sections**:
  - Trending Now (`trending` tag)
  - Top Picks (`top-picks` tag)
  - New Releases (`new-releases` tag)
  - Most Recommended (`most-recommended` tag)
  - Continue Watching (from local storage)
  - Categories (horizontal category chips)
- **Vertical Reels/Shorts Feed**: TikTok-style for `Short` type content
- **Pull to Refresh**
- **Infinite Scroll** for pagination

#### B. **Explore/Browse Screen**
- **Search Bar** with typeahead (use `/webseries/search`)
- **Category Filters** (horizontal chips)
- **Type Filters**: Movies, Shows, Shorts (tabs)
- **Tag Filters**: Trending, New Releases, etc.
- **Grid/List View Toggle**
- **Sort Options**: Latest, Popular, A-Z

#### C. **WebSeries Detail Screen**
- **Cover Image** (full-width hero)
- **Title, Description, Duration**
- **Categories** (chips)
- **Action Buttons**:
  - Play (primary CTA)
  - Add to Favorites (heart icon)
  - Like (thumbs up icon)
  - Share
- **Episodes List** (for Shows):
  - Episode number, title, duration
  - Lock icon for paid episodes (if not subscribed)
- **Similar Content** (based on categories)
- **Like/Favorite Counts**

#### D. **Video Player Screen**
- **Full-Screen HLS Video Player** (expo-av or react-native-video)
- **Controls**:
  - Play/Pause
  - Seek bar with preview thumbnails (optional)
  - 10s forward/backward
  - Quality selector (if multiple m3u8 streams)
  - Fullscreen toggle
  - Cast to TV (optional)
- **Overlay UI**:
  - Title, episode info
  - Like/Favorite buttons
  - Next episode button (auto-play countdown)
- **Picture-in-Picture** (PiP) support
- **Resume Playback** (save progress to AsyncStorage)

#### E. **Favorites Screen**
- **List of Favorited Content**
- **Filter by Type**: All, Movies, Shows, Shorts
- **Swipe to Remove**
- **Empty State** with CTA

#### F. **Profile Screen**
- **User Info**: Avatar, name, email
- **Subscription Status**:
  - Plan name (Free, Basic, Premium)
  - Expiry date
  - Upgrade CTA
- **Settings**:
  - Theme (Light/Dark)
  - Language
  - Notifications
  - Account management
- **Logout**

#### G. **Authentication Flow**
- **Onboarding Screens** (3 slides with skip)
- **Login Options**:
  - Sign in with Apple
  - Sign in with Google
  - Email/Password (optional)
  - Guest Mode (limited access)
- **Device ID Tracking**: Generate and store `udid` using `expo-device`
- **Auto-Login**: Store `social_id` or `email` in AsyncStorage

#### H. **Subscription/Paywall**
- **Subscription Plans**:
  - Free: Limited content
  - Basic: $4.99/month
  - Premium: $9.99/month (all content + offline)
- **Payment Integration**: Expo In-App Purchases (iOS/Android)
- **Paywall Trigger**: When user tries to play `isPaid: true` episode
- **Trial Period**: 7-day free trial

#### I. **Offline Mode** (Premium Feature)
- **Download Episodes**: Store locally using expo-file-system
- **Downloaded Content Screen**
- **Storage Management**

---

### 3. **State Management**

#### Zustand Stores

### 4. **API Service Layer**

Create a centralized API service with Axios:

```typescript
// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add API key)
api.interceptors.request.use(async (config) => {
  const apiKey = process.env.EXPO_PUBLIC_MOBILE_API_KEY;
  if (apiKey) {
    config.headers['X-API-KEY'] = apiKey;
  }
  return config;
});

// Response interceptor (error handling)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default api;
```

**API Methods:**
```typescript
// services/webseries.ts
export const webseriesApi = {
  getAll: (params: GetWebSeriesParams) => api.get('/webseries', { params }),
  getById: (id: string) => api.get(`/webseries/${id}`),
  search: (q: string, limit?: number) => api.get('/webseries/search', { params: { q, limit } }),
};

// services/likes.ts
export const likesApi = {
  check: (webseriesId: string, params: { social_id: string; episode_number?: number }) =>
    api.get(`/likes/${webseriesId}/like`, { params }),
  add: (webseriesId: string, data: { social_id: string; episode_number?: number }) =>
    api.post(`/likes/${webseriesId}/like`, data),
  remove: (webseriesId: string, data: { social_id: string; episode_number?: number }) =>
    api.delete(`/likes/${webseriesId}/like`, { data }),
  getCount: (webseriesId: string) => api.get(`/likes/${webseriesId}/like/count`),
};

// services/favorites.ts (similar structure)
// services/users.ts (similar structure)
```

---

### 6. **Performance Optimizations**

- **Image Optimization**: Use `expo-image` with `contentFit="cover"` and `placeholder`
- **List Virtualization**: Use `FlashList` instead of `FlatList` for better performance
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback` for expensive components
- **Lazy Loading**: Load images and videos on-demand
- **Caching**: Use React Query for API response caching
- **Code Splitting**: Use dynamic imports for heavy screens

---

### 7. **Error Handling & Edge Cases**

- **Network Errors**: Show retry button with toast notification
- **Empty States**: Custom illustrations for no content, no favorites, etc.
- **Loading States**: Skeleton loaders for all lists
- **Offline Mode**: Detect network status and show offline banner
- **API Errors**: Parse error messages from API response and display user-friendly messages
- **Video Playback Errors**: Fallback to lower quality or show error modal

---

## Key Implementation Notes

### User Identification Strategy
Since the API uses `social_id`, `email`, or `udid` for user identification:
1. **On first launch**: Generate a unique `udid` using `expo-device` and store in AsyncStorage
2. **After social login**: Store `social_id` from Apple/Google
3. **API calls**: Always send `social_id` (if logged in) or `udid` (guest mode)

### Watch Progress Tracking
```typescript
// Save progress every 5 seconds
const saveProgress = async (webseriesId: string, episodeNumber: number, progress: number) => {
  const key = `watch_${webseriesId}_${episodeNumber}`;
  await AsyncStorage.setItem(key, JSON.stringify({ progress, timestamp: Date.now() }));
};

// Resume playback
const getProgress = async (webseriesId: string, episodeNumber: number) => {
  const key = `watch_${webseriesId}_${episodeNumber}`;
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data).progress : 0;
};
```


## Step-by-Step Implementation Guide

### Phase 1: Project Setup (Day 1)
1. Initialize Expo project with TypeScript template
2. Install dependencies (NativeWind, Zustand, Axios, etc.)
3. Configure NativeWind and Tailwind
4. Set up Expo Router file structure
5. Create API service layer with Axios interceptors
6. Set up environment variables

### Phase 2: Authentication (Day 2-3)
1. Create onboarding screens
2. Implement Sign in with Apple/Google
3. Create user upsert API integration
4. Set up AsyncStorage for user persistence
5. Create auth store with Zustand
6. Implement device ID generation (udid)

### Phase 3: Core UI Components (Day 4-5)
1. Create reusable components (Button, Card, Input, etc.)
2. Build WebSeries card component
3. Create horizontal scrollable list component
4. Build category chip component
5. Create skeleton loaders
6. Implement bottom sheet for filters

### Phase 4: Home Screen (Day 6-7)
1. Fetch and display hero banner
2. Implement horizontal sections (Trending, Top Picks, etc.)
3. Add pull-to-refresh
4. Implement infinite scroll
5. Add category filters
6. Create vertical reels feed for Shorts

### Phase 5: WebSeries Detail Screen (Day 8-9)
1. Fetch and display webseries details
2. Implement like/favorite buttons with API integration
3. Create episodes list (for Shows)
4. Add similar content section
5. Implement share functionality
6. Handle paid content logic

### Phase 6: Video Player (Day 10-12)
1. Integrate expo-av or react-native-video
2. Implement HLS video playback
3. Create custom video controls
4. Add seek bar with progress
5. Implement like/favorite overlay
6. Add next episode auto-play
7. Save watch progress to AsyncStorage
8. Implement PiP mode

### Phase 7: Explore & Search (Day 13-14)
1. Create search screen with typeahead
2. Implement category filters
3. Add type filters (Movies, Shows, Shorts)
4. Create grid/list view toggle
5. Implement sort options
6. Add filter bottom sheet

### Phase 8: Favorites & Profile (Day 15-16)
1. Create favorites screen with API integration
2. Implement swipe-to-remove
3. Build profile screen
4. Display subscription status
5. Create settings screen (theme, language, etc.)
6. Implement logout functionality

### Phase 9: Subscription & Paywall (Day 17-18)
1. Create subscription plans screen
2. Implement paywall modal
3. Integrate Expo In-App Purchases
4. Handle subscription status in user store
5. Lock paid content for non-subscribers
6. Add trial period logic

### Phase 10: Polish & Testing (Day 19-21)
1. Add animations and transitions
2. Implement error handling and retry logic
3. Create empty states for all screens
4. Add loading states and skeleton loaders
5. Test on iOS and Android devices
6. Fix bugs and optimize performance
7. Add analytics tracking
8. Prepare for deployment

---



