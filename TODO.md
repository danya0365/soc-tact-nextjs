# Soccer Tactics - TODO List

## 📋 Project Overview
แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล พร้อมระบบตารางคะแนนลีกและ Live Score

---

## 🎯 Phase 1: Foundation & Core Setup

### 1.1 Project Architecture
- [x] Setup Next.js 15 with App Router
- [x] Setup TypeScript
- [x] Setup Tailwind CSS v4
- [x] Setup Zustand for state management
- [x] Setup localforage for persistence
- [x] Setup axios for HTTP client
- [ ] Create Clean Architecture folder structure
  - [ ] `/src/domain` - Entities, Interfaces, Types
  - [ ] `/src/application` - Use Cases, DTOs, Services
  - [ ] `/src/infrastructure` - API clients, Repositories
  - [ ] `/src/presentation` - Components, Presenters, Hooks

### 1.2 Design System
- [ ] Create color palette for football theme
  - [ ] Primary colors (green pitch, white, dark)
  - [ ] Team colors support
  - [ ] Status colors (live, finished, upcoming)
- [ ] Setup typography with MiSans Thai font
- [ ] Create component library
  - [ ] Buttons
  - [ ] Cards
  - [ ] Modals
  - [ ] Forms
  - [ ] Tables
  - [ ] Badges
- [ ] Implement Dark Mode
- [ ] Create responsive breakpoints

### 1.3 Database & Backend ✅ IN PROGRESS
- [x] Choose database (Supabase/PostgreSQL) ✅
- [x] Initialize Supabase project ✅
- [ ] Design database schema
  - [x] **Authentication & Profiles** (Multiple Profiles Architecture) ✅
    - [x] `auth.users` - Authentication table (1 user = 1 auth account)
    - [x] `public.profiles` - User profiles (1 user can have multiple profiles)
      - Each user can create multiple profiles (e.g., personal, gaming, tech)
      - Only 1 profile can be active at a time (`is_active` flag)
      - All app data connects to `profiles.id`, NOT `auth.id` directly
    - [x] `public.profile_roles` - Role management per profile (user, moderator, admin)
    - [x] Profile management functions (set_profile_active, get_active_profile, get_user_profiles)
  - [ ] **Tactical Posts & Content**
    - [ ] `posts` - Tactical analysis posts
    - [ ] `post_tags` - Tags for posts
    - [ ] `post_formations` - Formation data
    - [ ] `post_media` - Images/videos attached to posts
  - [ ] **Social Features**
    - [ ] `comments` - Comments on posts (nested replies support)
    - [ ] `reactions` - Upvotes/downvotes on posts and comments
    - [ ] `follows` - User following system
    - [ ] `bookmarks` - Saved posts
  - [ ] **Match Data** (from API or cached)
    - [ ] `matches` - Match information cache
    - [ ] `match_events` - Match timeline/events
    - [ ] `match_statistics` - Match stats cache
  - [ ] **League & Team Data** (from API or cached)
    - [ ] `leagues` - League information
    - [ ] `teams` - Team information
    - [ ] `standings` - League table cache
  - [ ] **Notifications**
    - [ ] `notifications` - User notifications
- [x] Setup authentication (Supabase Auth) ✅
- [ ] Create API endpoints structure
  - [ ] Posts CRUD
  - [ ] Comments CRUD
  - [ ] Reactions CRUD
  - [ ] User profile management
  - [ ] Search & discovery
- [ ] Setup real-time subscriptions
  - [ ] Live scores updates
  - [ ] New comments notifications
  - [ ] Real-time reactions

---

## 🎨 Phase 2: UI Development with Mock Data (Current Focus)

### 2.0 UI Pages Priority List
**Strategy: Build UI first with Mock Data, then integrate real API later**

#### 🏠 **Landing Page** (In Progress)
- [x] Basic structure with LandingPresenter
- [x] Football API integration setup
- [ ] Complete Hero section
  - [ ] Pitch background with gradient overlay
  - [ ] Main headline & tagline
  - [ ] CTA buttons (เข้าสู่ระบบ, สมัครสมาชิก)
  - [ ] Search bar for matches/teams
- [ ] Live Matches Section (Mock Data)
  - [ ] Match cards with live indicator
  - [ ] Score display
  - [ ] Team logos & names
  - [ ] Match time/status
  - [ ] Quick filters (All, Live, Today, Tomorrow)
- [ ] League Tables Preview (Mock Data)
  - [ ] Top 5 teams from popular leagues
  - [ ] League selector tabs
  - [ ] Mini table with position, team, points
  - [ ] "View Full Table" link
- [ ] Featured Tactical Posts (Mock Data)
  - [ ] Post cards with thumbnail
  - [ ] Formation badge
  - [ ] Author info
  - [ ] Upvotes & comments count
  - [ ] "Read More" link
- [ ] Statistics Section
  - [ ] Total posts, users, matches, leagues
  - [ ] Animated counters
  - [ ] Icon representations
- [ ] Popular Leagues Carousel
  - [ ] League logos
  - [ ] League names
  - [ ] Click to view league page
- [ ] Footer
  - [ ] About, Contact, Terms, Privacy links
  - [ ] Social media links
  - [ ] Newsletter signup

#### ⚽ **Match Center Pages** ✅ COMPLETED
- [x] `/matches` - All Matches Page (Mock Data)
  - [x] Filter bar (Date, League, Status)
  - [x] Match list with cards
  - [x] Pagination
  - [x] Live indicator animation
  - [x] Empty state for no matches
- [x] `/matches/[id]` - Match Detail Page (Mock Data)
  - [x] Match header (teams, score, time)
  - [x] Match statistics (possession, shots, etc.)
  - [x] Team lineups (formation view)
  - [x] Match timeline/events
  - [x] Head-to-head history
  - [x] Related tactical posts
  - [x] Comments section

#### 📊 **League Tables Pages** ✅ COMPLETED
- [x] `/leagues` - All Leagues Page (Mock Data)
  - [x] League cards grid
  - [x] League logos & names
  - [x] Current season info
  - [x] "View Table" button
- [x] `/leagues/[id]` - League Table Page (Mock Data)
  - [x] Full standings table
  - [x] Position, team, stats (P, W, D, L, GF, GA, GD, Pts)
  - [x] Form indicators (last 5 matches)
  - [x] Highlight zones (Champions League, Europa, Relegation)
  - [x] Filter (Overall, Home, Away)
  - [x] Top scorers section
  - [x] Upcoming fixtures

#### 🎨 **Tactical Analysis Pages** ✅ COMPLETED
- [x] `/tactics` - Tactics Feed Page (Mock Data)
  - [x] Post cards grid view
  - [x] Filter by formation, search
  - [x] Sort by (Latest, Popular, Trending)
  - [x] Search functionality
  - [x] Pagination
- [x] `/tactics/[id]` - Tactical Post Detail (Mock Data)
  - [x] Post title & metadata
  - [x] Author profile card
  - [x] Rich text content
  - [x] Formation badge
  - [x] Related match context
  - [x] Tags & categories
  - [x] Upvote/downvote buttons
  - [x] Comments section with replies
  - [x] Share buttons
  - [x] Related posts
- [ ] `/tactics/create` - Create Tactical Post (TODO)
  - [ ] Rich text editor
  - [ ] Formation selector
  - [ ] Pitch canvas/editor (basic)
  - [ ] Image upload
  - [ ] Match/team linking
  - [ ] Tags input
  - [ ] Preview mode
  - [ ] Save draft
  - [ ] Publish button

#### 👤 **User Profile Pages**
- [ ] `/profile/[username]` - Public Profile (Mock Data)
  - [ ] Profile header (avatar, name, bio)
  - [ ] Stats (posts, followers, following)
  - [ ] Favorite teams & leagues
  - [ ] Tactical philosophy
  - [ ] User's posts feed
  - [ ] Follow/unfollow button
- [ ] `/profile/settings` - Profile Settings (Mock Data)
  - [ ] Edit profile form
  - [ ] Avatar upload
  - [ ] Favorite teams selector
  - [ ] Notification preferences
  - [ ] Privacy settings

#### 🔐 **Authentication Pages**
- [ ] `/auth/login` - Login Page
  - [ ] Email/password form
  - [ ] Social login buttons (Google, Facebook)
  - [ ] "Forgot password" link
  - [ ] "Sign up" link
  - [ ] Football-themed background
- [ ] `/auth/register` - Register Page
  - [ ] Registration form
  - [ ] Email verification notice
  - [ ] Terms & conditions checkbox
  - [ ] Social signup buttons
- [ ] `/auth/forgot-password` - Forgot Password
  - [ ] Email input form
  - [ ] Reset instructions
- [ ] `/auth/setup` - Profile Setup Wizard
  - [ ] Step 1: Favorite teams
  - [ ] Step 2: Favorite leagues
  - [ ] Step 3: Preferred formations
  - [ ] Progress indicator

#### 🔍 **Search & Discovery Pages**
- [ ] `/search` - Search Results Page (Mock Data)
  - [ ] Search input with suggestions
  - [ ] Tabs (All, Posts, Users, Teams, Matches)
  - [ ] Filter sidebar
  - [ ] Results grid/list
  - [ ] Pagination
- [ ] `/explore` - Explore/Discovery Page (Mock Data)
  - [ ] Trending posts
  - [ ] Hot topics
  - [ ] Featured analysts
  - [ ] Popular formations
  - [ ] League highlights

#### 🏆 **Team Pages** ✅ COMPLETED
- [x] `/teams/[id]` - Team Profile Page (Mock Data)
  - [x] Team header (logo, name, stadium, manager)
  - [x] Current squad list with stats
  - [x] Recent matches
  - [x] Upcoming fixtures
  - [x] Team statistics (position, points, goals)
  - [x] Tactical analysis posts about team
  - [x] Link from League Table

### 2.1 Component Library (Shared Components)
- [ ] **Layout Components**
  - [ ] MainLayout (with header, footer)
  - [ ] AuthLayout (for login/register)
  - [ ] DashboardLayout (for user dashboard)
- [ ] **Navigation Components**
  - [ ] Navbar (with search, user menu)
  - [ ] Sidebar (for filters)
  - [ ] Breadcrumbs
  - [ ] Tabs
- [ ] **Card Components**
  - [ ] MatchCard (live, upcoming, finished)
  - [ ] PostCard (tactical analysis)
  - [ ] TeamCard
  - [ ] LeagueCard
  - [ ] UserCard
- [ ] **Data Display**
  - [ ] LeagueTable (standings)
  - [ ] FormationPitch (tactical view)
  - [ ] MatchTimeline
  - [ ] StatisticsBar
  - [ ] ProgressBar
- [ ] **Form Components**
  - [ ] Input (text, email, password)
  - [ ] TextArea
  - [ ] Select/Dropdown
  - [ ] Checkbox/Radio
  - [ ] DatePicker
  - [ ] SearchInput
- [ ] **Feedback Components**
  - [ ] Button (primary, secondary, ghost)
  - [ ] Badge (status, formation, league)
  - [ ] Alert/Toast
  - [ ] Modal/Dialog
  - [ ] Loading Spinner
  - [ ] Empty State
  - [ ] Error State
- [ ] **Interactive Components**
  - [ ] VoteButtons (upvote/downvote)
  - [ ] ShareButtons
  - [ ] FollowButton
  - [ ] CommentBox
  - [ ] ReactionPicker

### 2.2 Mock Data Structure ✅ COMPLETED
- [x] Create `/src/data/mock/` folder
- [x] **matches.mock.ts** - Mock match data (8 matches)
- [x] **leagues.mock.ts** - Mock league data (6 leagues + standings)
- [x] **teams.mock.ts** - Mock team data (3 teams + squads)
- [x] **tactics.mock.ts** - Mock tactical posts (5 posts + comments)
- [x] **users.mock.ts** - Mock user data (3 users + posts)

### 2.3 Progress Summary
**✅ COMPLETED PAGES (8 main sections):**
- **Landing Page** (1 page) - Hero, Stats, Live Matches, League Table, Featured Posts
- **Match Center** (2 pages)
- **League Tables** (2 pages)
- **Tactical Analysis** (3 pages) - Feed, Detail, Create
- **Team Pages** (1 page)
- **User Profiles** (2 pages) - Profile, Settings
- **Search & Discovery** (2 pages) - Search, Explore
- **Navigation & Layout** (Global) - Navbar, Footer

**Total: 13 pages with full functionality + Global Layout**

**Platform Completion: 100%** 🎉🎉🎉

---

## 🎯 Phase 2.5: Recommended Next UI Pages (Priority Order)

### 🔥 HIGH PRIORITY - Core User Experience

#### 1. **Landing Page Enhancement** ✅ COMPLETED
**Why:** First impression, SEO, User engagement
- [x] Complete Hero section with pitch background
- [x] Live Matches Section (4 matches from mock data)
- [x] League Tables Preview (top 5 teams)
- [x] Featured Tactical Posts (3 posts)
- [x] Statistics counters (animated)
- [x] Footer with links
- [x] CTA section
- [x] Fully responsive design

**Estimated Time:** 2-3 hours
**Impact:** Very High - Main entry point

#### 2. **Navigation & Layout** ✅ COMPLETED
**Why:** Essential for user navigation
- [x] Global Navbar with links to all sections
- [x] Mobile responsive menu
- [x] Search bar (functional, links to /search)
- [x] User menu with profile link
- [x] Footer component (reusable)
- [x] Explore link in navbar

**Estimated Time:** 2-3 hours
**Impact:** Very High - Used on every page

#### 3. **Create Tactical Post Page** (`/tactics/create`) ✅ COMPLETED
**Why:** Enable content creation
- [x] Rich text editor (textarea with markdown support)
- [x] Formation selector dropdown (10 formations)
- [x] Match/Team linking (optional selectors)
- [x] Tags input (add/remove tags)
- [x] Preview mode toggle
- [x] Submit button with validation
- [x] Save draft button

**Estimated Time:** 3-4 hours
**Impact:** High - Core feature for analysts

### 📊 MEDIUM PRIORITY - User Engagement

#### 4. **User Profile Pages** ✅ COMPLETED
**Why:** User identity and personalization
- [x] `/profile/[username]` - Public profile
  - [x] User info & bio
  - [x] User's tactical posts
  - [x] Stats (posts, upvotes, followers)
  - [x] Favorite teams
  - [x] Follow/Unfollow button
  - [x] Social links
- [x] `/profile/settings` - Settings page
  - [x] Edit profile form (3 tabs)
  - [x] Favorite teams selector
  - [x] Notification preferences
  - [x] Privacy settings
  - [x] Change password
- [x] Integration with Navbar

**Estimated Time:** 4-5 hours
**Impact:** Medium - Builds community

#### 5. **Search & Discovery** ✅ COMPLETED
**Why:** Content discovery
- [x] `/search` - Search results page
  - [x] Search input with query params
  - [x] Tabs (All, Posts, Teams, Matches)
  - [x] Results list with filtering
  - [x] Empty state
- [x] `/explore` - Discovery page
  - [x] Trending posts (sorted by views)
  - [x] Popular formations
  - [x] Featured analysts
  - [x] Hot topics (tags)
  - [x] League highlights
- [x] Integration with Navbar search bar

**Estimated Time:** 3-4 hours
**Impact:** Medium - Improves engagement

---

## 🎨 **OPTIONAL UI ENHANCEMENTS** (Nice to have, not required)

### 🔹 **Interactive Components** ⭐⭐⭐
**Why:** Better user interaction
- [ ] **VoteButtons Component** - Upvote/Downvote with animation
- [ ] **ShareButtons Component** - Share to social media
- [ ] **FollowButton Component** - Follow/Unfollow with state
- [ ] **CommentBox Component** - Rich comment editor (currently basic)
- [ ] **ReactionPicker Component** - Emoji reactions

**Estimated Time:** 2-3 hours
**Impact:** Medium - Improves engagement

### 🔹 **Loading & Empty States** ⭐⭐⭐
**Why:** Better UX feedback
- [ ] **Skeleton Loaders** - For all list views (currently basic spinners)
- [ ] **Empty State Illustrations** - Custom illustrations (currently using emojis)
- [ ] **Error Boundaries** - Graceful error handling (basic implemented)
- [ ] **Toast Notifications** - Success/Error messages (currently alerts)

**Estimated Time:** 2-3 hours
**Impact:** Medium - Better UX polish

### 🔹 **Advanced Filters** ⭐⭐
**Why:** Better content discovery
- [ ] **Advanced Search Filters** - Date range, formation, league (basic implemented)
- [ ] **Sort Options** - Latest, Popular, Trending (basic implemented)
- [ ] **Filter Sidebar** - For tactics page
- [ ] **Save Filters** - Remember user preferences

**Estimated Time:** 2-3 hours
**Impact:** Low-Medium - Power users

### 🔹 **Notifications Page** ⭐⭐
**Why:** User engagement
- [ ] `/notifications` - Notification center
  - [ ] List of notifications
  - [ ] Mark as read
  - [ ] Filter by type
  - [ ] Real-time updates (requires backend)

**Estimated Time:** 2-3 hours
**Impact:** Low - Can add later with backend

### 🔹 **Authentication Pages** ✅ COMPLETED
**Why:** User management (mock data for now)
- [x] `/auth/login` - Login page with demo credentials
- [x] `/auth/register` - Register page with validation
- [x] `/auth/forgot-password` - Password reset flow
- [x] Social login buttons (Google, Facebook)
- [x] Form validation
- [x] Success/Error messages
- [x] Redirect after login/register

**Estimated Time:** 3-4 hours
**Impact:** Low for MVP - Using mock authentication

---

## 📋 **UI DEVELOPMENT SUMMARY**

### ✅ **COMPLETED (100%)**
All core UI pages are complete and functional:

1. ✅ Landing Page with Hero, Stats, Live Matches, League Table, Featured Posts
2. ✅ Navigation & Layout (Navbar + Footer)
3. ✅ Match Center (2 pages)
4. ✅ League Tables (2 pages)
5. ✅ Tactical Analysis (3 pages)
6. ✅ Team Pages (1 page)
7. ✅ User Profiles (2 pages)
8. ✅ Search & Discovery (2 pages)
9. ✅ Authentication (3 pages) - Login, Register, Forgot Password

**Total: 16 pages + Global Layout = 100% Complete** 🎉🎉🎉

### 🎯 **MISSING UI (Optional Enhancements)**
None of the core UI is missing! All optional enhancements listed above are "nice to have" but NOT required for a functional platform.

### 🚀 **RECOMMENDED NEXT STEPS**

Since UI is 100% complete, you have 3 options:

#### **Option A: Backend Integration** 🔥 RECOMMENDED
1. Set up Supabase project
2. Create database schema
3. Implement authentication (JWT)
4. Connect API endpoints
5. Replace mock data with real data

#### **Option B: Polish & Refinement** ✨
1. Add interactive components (Vote, Share, Follow)
2. Implement skeleton loaders
3. Add toast notifications
4. Improve animations
5. Add micro-interactions

#### **Option C: Deploy & Test** 🚀
1. Deploy to Vercel
2. Test on real devices
3. Performance optimization
4. SEO optimization
5. Collect user feedback

---

## 🔌 Phase 3: Backend Integration & Real Data

### 3.0 Database Schema Implementation ✅ COMPLETED
**Architecture: Multiple Profiles per User**
- 1 `auth.users` account can have multiple `profiles`
- Only 1 profile is `is_active = true` at a time
- All app data (posts, comments, follows) connects to `profiles.id`, NOT `auth.id`

#### 3.0.1 Core Tables (Foundation) ✅ DONE
- [x] **Profiles System** ✅ DONE
  - [x] `auth.users` - Supabase authentication
  - [x] `public.profiles` - User profiles with multiple profile support
  - [x] `public.profile_roles` - Role management (user, moderator, admin)
  - [x] Profile management RPC functions

#### 3.0.2 Football Data Cache Tables ✅ DONE
- [x] **Football Data Schema** (10 tables with `football_` prefix)
  - [x] `football_leagues` - League/competition data (cache: 24h)
  - [x] `football_teams` - Team information (cache: 24h)
  - [x] `football_matches` - Match data (cache: 30s live, 1h finished)
  - [x] `football_standings` - League tables (cache: 1h)
  - [x] `football_players` - Player information (cache: 24h)
  - [x] `football_match_statistics` - Match stats (cache: 5min)
  - [x] `football_match_events` - Goals, cards, substitutions (cache: 30s)
  - [x] `football_lineups` - Team lineups (permanent)
  - [x] `football_top_scorers` - Top scorers (cache: 1h)
  - [x] `football_api_sync_log` - API sync monitoring
  - [x] Custom types: `football_match_status`, `football_event_type`, `football_player_position`
  - [x] Helper functions: `is_cache_expired()`, `get_live_matches()`, `get_matches_by_date()`, `get_standings_by_league()`
  - [x] Comprehensive indexes for performance
  - [x] Auto-update triggers for `updated_at`

#### 3.0.3 Infrastructure Setup ✅ COMPLETED
- [x] **Supabase Client Configuration**
  - [x] Created `/src/infrastructure/config/supabase.ts`
  - [x] Client-side and server-side clients
  - [x] TypeScript types generated from database
  - [x] Environment variables configured
  
- [x] **Football Repository Implementation**
  - [x] Created `/src/infrastructure/repositories/supabase-football.repository.ts`
  - [x] Implements `FootballRepository` interface
  - [x] Smart caching with expiration
  - [x] API rate limit protection (10 req/min)
  - [x] Comprehensive error handling and logging
  - [x] Fixed arrow function binding for mapping methods
  
- [x] **Football Sync Service**
  - [x] Created `/src/application/services/football-sync.service.ts`
  - [x] Background sync jobs (live matches: 30s, standings: 1h, leagues: 24h)
  - [x] Rate limit compliance (6s delay between requests)
  - [x] Manual sync methods for specific resources
  
- [x] **API Endpoints - Basic**
  - [x] `POST /api/football/sync` - Start sync service
  - [x] `DELETE /api/football/sync` - Stop sync service
  - [x] `GET /api/football/sync/status` - Check sync status
  - [x] `GET /api/football/matches/live` - Get live matches from cache
  
- [x] **API Endpoints - Manual Sync**
  - [x] `POST /api/football/sync/all` - Sync everything
  - [x] `POST /api/football/sync/leagues` - Sync leagues
  - [x] `POST /api/football/sync/standings/[leagueId]` - Sync specific league standings
  - [x] `POST /api/football/sync/matches/[leagueId]` - Sync specific league matches
  - [x] `POST /api/football/sync/match/[matchId]` - Sync specific match

- [x] **Documentation**
  - [x] Created `FOOTBALL_SYNC_GUIDE.md` with complete setup instructions

#### 3.0.4 Football Data Sync Status ✅ COMPLETED & TESTED
- [x] **Successfully Implemented & Tested**
  - [x] **Leagues:** 13 leagues cached ✅
  - [x] **Teams:** 150+ teams cached ✅
  - [x] **Standings:** 8 leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Eredivisie, Primeira Liga) ✅
  - [x] **Top Scorers:** Implemented with players sync ✅
  - [x] **Players:** Auto-cached from top scorers data ✅
  - [x] **Upcoming Matches:** Implemented with API fetch ✅
  - [x] **Finished Matches:** Implemented with API fetch ✅
  - [x] **Live Matches:** Implemented with 30s auto-refresh ✅
  
- [x] **Manual Sync Endpoints Created**
  - [x] `POST /api/football/sync/all` - Comprehensive full sync
  - [x] `POST /api/football/sync/leagues` - Sync leagues
  - [x] `POST /api/football/sync/standings/[leagueId]` - Sync standings
  - [x] `POST /api/football/sync/scorers/[leagueId]` - Sync top scorers
  - [x] `POST /api/football/sync/matches/[leagueId]` - Sync league matches
  - [x] `POST /api/football/sync/matches/upcoming` - Sync upcoming matches
  - [x] `POST /api/football/sync/matches/finished` - Sync finished matches
  - [x] `POST /api/football/sync/match/[matchId]` - Sync specific match with details
  - [x] `POST /api/football/sync/matches/details` - Batch sync match details (stats, events, lineups)
  
- [x] **Advanced Features Implemented**
  - [x] Match statistics sync (possession, shots, corners, fouls, cards, offsides)
  - [x] Match events sync (goals, yellow cards, red cards, substitutions)
  - [x] Match lineups sync (starting XI + substitutes with positions)
  - [x] Batch sync endpoint for match details
  - [ ] Head-to-head data (future)
  
- [x] **Documentation**
  - [x] `FOOTBALL_SYNC_GUIDE.md` - Setup and usage guide
  - [x] `FOOTBALL_SYNC_API.md` - Complete API reference with testing strategy

#### 3.0.2 Content Tables
- [ ] **Posts & Tactical Analysis**
  - [ ] `posts` table
    ```sql
    - id (uuid, primary key)
    - profile_id (uuid, references profiles.id) -- NOT auth.id!
    - title (text)
    - content (text)
    - formation (text) -- e.g., "4-3-3", "4-4-2"
    - match_id (uuid, nullable) -- link to match if analyzing specific match
    - team_id (uuid, nullable) -- link to team if analyzing team tactics
    - thumbnail_url (text)
    - view_count (integer)
    - upvote_count (integer)
    - comment_count (integer)
    - is_published (boolean)
    - published_at (timestamp)
    - created_at, updated_at
    ```
  - [ ] `post_tags` table (many-to-many)
    ```sql
    - id (uuid)
    - post_id (uuid, references posts.id)
    - tag (text) -- e.g., "pressing", "counter-attack"
    ```
  - [ ] `post_media` table (images/videos)
    ```sql
    - id (uuid)
    - post_id (uuid, references posts.id)
    - media_type (text) -- "image" or "video"
    - media_url (text)
    - caption (text)
    - sort_order (integer)
    ```

#### 3.0.3 Social Features Tables
- [ ] **Comments System**
  - [ ] `comments` table (nested replies support)
    ```sql
    - id (uuid)
    - post_id (uuid, references posts.id)
    - profile_id (uuid, references profiles.id) -- NOT auth.id!
    - parent_comment_id (uuid, nullable) -- for nested replies
    - content (text)
    - upvote_count (integer)
    - created_at, updated_at
    ```

- [ ] **Reactions System**
  - [ ] `post_reactions` table
    ```sql
    - id (uuid)
    - post_id (uuid, references posts.id)
    - profile_id (uuid, references profiles.id) -- NOT auth.id!
    - reaction_type (text) -- "upvote" or "downvote"
    - created_at
    - UNIQUE(post_id, profile_id)
    ```
  - [ ] `comment_reactions` table
    ```sql
    - id (uuid)
    - comment_id (uuid, references comments.id)
    - profile_id (uuid, references profiles.id) -- NOT auth.id!
    - reaction_type (text)
    - created_at
    - UNIQUE(comment_id, profile_id)
    ```

- [ ] **Follow System**
  - [ ] `follows` table
    ```sql
    - id (uuid)
    - follower_profile_id (uuid, references profiles.id)
    - following_profile_id (uuid, references profiles.id)
    - created_at
    - UNIQUE(follower_profile_id, following_profile_id)
    ```

- [ ] **Bookmarks**
  - [ ] `bookmarks` table
    ```sql
    - id (uuid)
    - profile_id (uuid, references profiles.id) -- NOT auth.id!
    - post_id (uuid, references posts.id)
    - created_at
    - UNIQUE(profile_id, post_id)
    ```

#### 3.0.4 Match & League Data (Cache from API)
- [ ] **Match Data Cache**
  - [ ] `matches` table
    ```sql
    - id (uuid)
    - api_match_id (text, unique) -- ID from football API
    - home_team_id (uuid)
    - away_team_id (uuid)
    - home_score (integer)
    - away_score (integer)
    - status (text) -- "live", "finished", "upcoming"
    - match_date (timestamp)
    - league_id (uuid)
    - cached_at (timestamp)
    ```
  - [ ] `match_statistics` table
  - [ ] `match_events` table (goals, cards, substitutions)

- [ ] **League & Team Data Cache**
  - [ ] `leagues` table
  - [ ] `teams` table
  - [ ] `standings` table

#### 3.0.5 Notifications
- [ ] `notifications` table
  ```sql
  - id (uuid)
  - profile_id (uuid, references profiles.id) -- NOT auth.id!
  - type (text) -- "comment", "upvote", "follow", "mention"
  - content (text)
  - related_post_id (uuid, nullable)
  - related_comment_id (uuid, nullable)
  - related_profile_id (uuid, nullable)
  - is_read (boolean)
  - created_at
  ```

### 3.1 Row Level Security (RLS) Policies
- [ ] **Profiles RLS**
  - [ ] Users can view all profiles
  - [ ] Users can only update their own profiles
  - [ ] Users can only delete their own profiles
  
- [ ] **Posts RLS**
  - [ ] Anyone can view published posts
  - [ ] Users can only create posts with their active profile_id
  - [ ] Users can only update/delete their own posts
  
- [ ] **Comments RLS**
  - [ ] Anyone can view comments
  - [ ] Users can only create comments with their active profile_id
  - [ ] Users can only update/delete their own comments
  
- [ ] **Reactions RLS**
  - [ ] Users can only create reactions with their active profile_id
  - [ ] Users can only delete their own reactions
  
- [ ] **Follows RLS**
  - [ ] Users can only create follows with their active profile_id
  - [ ] Users can only delete their own follows

### 3.2 Connect Real Football API
- [ ] Choose API provider
  - [ ] API-Football (RapidAPI) - Recommended
  - [ ] Football-Data.org - Free tier
  - [ ] TheSportsDB - Free
- [ ] Create API service layer (`/src/infrastructure/api/football-api.ts`)
- [ ] Implement API endpoints
  - [ ] Get live matches
  - [ ] Get match details
  - [ ] Get league standings
  - [ ] Get team information
  - [ ] Get match statistics
- [ ] Setup caching strategy (cache in database)
- [ ] Setup error handling & fallbacks
- [ ] Setup real-time updates (polling every 30s for live matches)

### 3.3 Authentication Integration (Supabase Auth)
- [x] Login page UI ✅
- [x] Register page UI ✅
- [x] Forgot password UI ✅
- [ ] Connect Supabase Auth to login/register forms
- [ ] Implement JWT token management
- [ ] Setup protected routes (middleware)
- [ ] Email verification flow
- [ ] Social login (Google, Facebook)
- [ ] Profile setup wizard (after first login)
  - [ ] Create first profile
  - [ ] Select favorite teams
  - [ ] Select favorite leagues
  - [ ] Select preferred formations

### 3.4 Replace Mock Data with Real Data
- [ ] **Posts Feed** - Connect to `posts` table
- [ ] **Post Detail** - Connect to `posts` + `comments` tables
- [ ] **User Profile** - Connect to `profiles` table
- [ ] **Matches** - Connect to Football API + cache
- [ ] **League Tables** - Connect to Football API + cache
- [ ] **Teams** - Connect to Football API + cache
- [ ] **Search** - Implement full-text search on posts

---

## 💾 Phase 4: Database & Backend Setup

### 3.1 Live Score Integration
- [ ] Choose football API provider
  - [ ] API-Football (RapidAPI)
  - [ ] Football-Data.org
  - [ ] LiveScore API
- [ ] Create API service layer
- [ ] Implement live score fetching
- [ ] Setup WebSocket/polling for real-time updates
- [ ] Create match status indicators
  - [ ] Live (pulsing red dot)
  - [ ] Finished
  - [ ] Upcoming
  - [ ] Postponed

### 3.2 Match Center UI
- [ ] Live matches widget (homepage)
- [ ] Match detail page
  - [ ] Score display
  - [ ] Team lineups
  - [ ] Match statistics
  - [ ] Timeline/events
  - [ ] Head-to-head history
- [ ] Match filter & search
  - [ ] By league
  - [ ] By date
  - [ ] By team
  - [ ] By status
- [ ] Match notifications
- [ ] Favorite matches system

---

## 📊 Phase 4: League Tables & Standings

### 4.1 League Tables
- [ ] Support major leagues
  - [ ] Premier League
  - [ ] La Liga
  - [ ] Serie A
  - [ ] Bundesliga
  - [ ] Ligue 1
  - [ ] Thai Premier League
  - [ ] Champions League
  - [ ] Europa League
- [ ] League table display
  - [ ] Position
  - [ ] Team name & logo
  - [ ] Played, Won, Drawn, Lost
  - [ ] Goals For/Against
  - [ ] Goal Difference
  - [ ] Points
  - [ ] Form (last 5 matches)
- [ ] League selector dropdown
- [ ] Season selector
- [ ] Table filters
  - [ ] Home/Away/Overall
  - [ ] Top 4, Top 6, Relegation zone highlights
- [ ] Auto-update standings

### 4.2 Team Pages
- [ ] Team profile page
  - [ ] Team info & logo
  - [ ] Current squad
  - [ ] Recent matches
  - [ ] Upcoming fixtures
  - [ ] Team statistics
  - [ ] Tactical analysis posts about team
- [ ] Team comparison tool
- [ ] Follow/favorite teams

---

## 🎨 Phase 5: Tactical Analysis Platform

### 5.1 Pitch Editor/Canvas
- [ ] Interactive football pitch canvas
- [ ] Player positioning tool
  - [ ] Drag & drop players
  - [ ] Formation templates (4-3-3, 4-4-2, 3-5-2, etc.)
  - [ ] Player roles/positions
- [ ] Drawing tools
  - [ ] Arrows (passing, movement)
  - [ ] Lines (defensive line, pressing zones)
  - [ ] Shapes (zones, areas)
  - [ ] Text annotations
- [ ] Save/export tactics
  - [ ] As image
  - [ ] As shareable link
  - [ ] As template

### 5.2 Analysis Post Creation
- [ ] Rich text editor
- [ ] Embed tactical diagrams
- [ ] Embed match clips/videos
- [ ] Add match context
  - [ ] Link to specific match
  - [ ] Link to teams
  - [ ] Link to players
- [ ] Tags & categories
  - [ ] Formation
  - [ ] Playing style
  - [ ] Tactical concept
  - [ ] League/competition
- [ ] Draft system
- [ ] Preview before publish

### 5.3 Analysis Post Display
- [ ] Post feed (homepage)
- [ ] Post detail page
- [ ] Author profile section
- [ ] Related posts
- [ ] Share functionality
- [ ] Bookmark/save posts

---

## 💬 Phase 6: Social Features

### 6.1 Community Interaction
- [ ] Comments system
  - [ ] Nested replies
  - [ ] Rich text comments
  - [ ] Mention users (@username)
  - [ ] Emoji reactions
- [ ] Voting system
  - [ ] Upvote/downvote posts
  - [ ] Upvote/downvote comments
  - [ ] Sort by votes
- [ ] Follow system
  - [ ] Follow users
  - [ ] Follow teams
  - [ ] Follow leagues
- [ ] Notifications
  - [ ] New comments on your posts
  - [ ] Mentions
  - [ ] Followers
  - [ ] Match updates (followed teams)

### 6.2 User Profiles
- [ ] Public profile page
  - [ ] Bio & avatar
  - [ ] Favorite teams & leagues
  - [ ] Tactical philosophy
  - [ ] Stats (posts, followers, following)
- [ ] User's posts feed
- [ ] User's saved posts
- [ ] User's comments history
- [ ] Profile settings
  - [ ] Edit profile
  - [ ] Privacy settings
  - [ ] Notification preferences

### 6.3 Gamification
- [ ] Reputation/karma system
- [ ] Badges & achievements
  - [ ] First post
  - [ ] 10 posts
  - [ ] 100 upvotes
  - [ ] Tactical expert
  - [ ] League specialist
- [ ] Leaderboard
  - [ ] Top analysts
  - [ ] Most active users
  - [ ] Rising stars

---

## 🔍 Phase 7: Search & Discovery

### 7.1 Search System
- [ ] Global search
  - [ ] Search posts
  - [ ] Search users
  - [ ] Search teams
  - [ ] Search matches
- [ ] Advanced filters
  - [ ] By date
  - [ ] By league
  - [ ] By formation
  - [ ] By tactical concept
- [ ] Search suggestions
- [ ] Recent searches

### 7.2 Discovery Features
- [ ] Trending posts
- [ ] Hot topics
- [ ] Featured analysts
- [ ] Recommended posts (personalized)
- [ ] Explore page
  - [ ] By league
  - [ ] By formation
  - [ ] By tactical style

---

## 📱 Phase 8: Mobile & Responsive

### 8.1 Mobile Optimization
- [ ] Responsive design for all pages
- [ ] Mobile navigation
  - [ ] Bottom navigation bar
  - [ ] Hamburger menu
- [ ] Touch-optimized pitch editor
- [ ] Mobile-friendly tables
- [ ] Swipe gestures
- [ ] Pull-to-refresh

### 8.2 Progressive Web App (PWA)
- [ ] Service worker setup
- [ ] Offline support
- [ ] Push notifications
- [ ] Add to home screen
- [ ] App manifest

---

## 🎯 Phase 9: Advanced Features

### 9.1 Video Analysis
- [ ] Video upload/embed
- [ ] Video player with annotations
- [ ] Timestamp comments
- [ ] Slow motion controls
- [ ] Side-by-side comparison

### 9.2 Statistics & Data Viz
- [ ] Player statistics
- [ ] Team statistics
- [ ] Match statistics
- [ ] Charts & graphs
  - [ ] Possession
  - [ ] Shots
  - [ ] Passing accuracy
  - [ ] Heat maps
  - [ ] Pass networks

### 9.3 AI Features (Future)
- [ ] AI-powered tactical suggestions
- [ ] Auto-generate analysis from match data
- [ ] Sentiment analysis on comments
- [ ] Content moderation

---

## 🚀 Phase 10: Performance & SEO

### 10.1 Performance Optimization
- [ ] Image optimization (Next.js Image)
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Caching strategy
- [ ] CDN setup
- [ ] Bundle size optimization

### 10.2 SEO
- [ ] Meta tags for all pages
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Structured data (Schema.org)
- [ ] Sitemap generation
- [ ] Robots.txt
- [ ] Canonical URLs

### 10.3 Analytics
- [ ] Google Analytics
- [ ] User behavior tracking
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

## 🔒 Phase 11: Security & Moderation

### 11.1 Security
- [ ] Input validation
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Content Security Policy
- [ ] Secure authentication

### 11.2 Moderation
- [ ] Report system
  - [ ] Report posts
  - [ ] Report comments
  - [ ] Report users
- [ ] Admin dashboard
  - [ ] Review reports
  - [ ] Ban users
  - [ ] Delete content
  - [ ] Moderate comments
- [ ] Content guidelines
- [ ] Community rules

---

## 📦 Phase 12: Deployment & Maintenance

### 12.1 Deployment
- [ ] Choose hosting platform
  - [ ] Vercel (recommended for Next.js)
  - [ ] Netlify
  - [ ] AWS
- [ ] Setup CI/CD pipeline
- [ ] Environment variables management
- [ ] Database backup strategy
- [ ] Monitoring & alerts

### 12.2 Documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] User guide
- [ ] Contributing guidelines
- [ ] README.md

### 12.3 Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Performance tests
- [ ] Accessibility tests

---

## 🎨 Design Assets Needed

- [ ] Logo design
- [ ] Favicon
- [ ] App icons (PWA)
- [ ] Social media images
- [ ] Pitch background images
- [ ] Team logos (from API)
- [ ] League logos (from API)
- [ ] Formation diagrams
- [ ] Illustration assets

---

## 📚 External APIs & Services

### Required APIs
- [ ] Football Data API
  - [ ] Live scores
  - [ ] League tables
  - [ ] Team info
  - [ ] Player info
  - [ ] Match statistics
- [ ] Authentication service
- [ ] Image hosting (Cloudinary/S3)
- [ ] Video hosting (YouTube/Vimeo)
- [ ] Email service (SendGrid/Mailgun)
- [ ] Push notification service

### Recommended API Providers
1. **API-Football** (RapidAPI) - Comprehensive football data
2. **Football-Data.org** - Free tier available
3. **TheSportsDB** - Free football data
4. **Sportradar** - Professional grade (paid)

---

## 🎯 MVP (Minimum Viable Product) Checklist

### Core Features for Launch
- [ ] User authentication
- [ ] Create tactical analysis posts
- [ ] Basic pitch editor
- [ ] Comment system
- [ ] Live scores widget
- [ ] League tables (top 5 leagues)
- [ ] User profiles
- [ ] Search functionality
- [ ] Responsive design
- [ ] Dark mode

### Nice to Have (Post-MVP)
- [ ] Video analysis
- [ ] Advanced statistics
- [ ] Gamification
- [ ] Mobile app
- [ ] AI features
- [ ] Premium features

---

## 📊 Success Metrics

- [ ] User registration rate
- [ ] Daily active users (DAU)
- [ ] Posts created per day
- [ ] Comments per post
- [ ] User retention rate
- [ ] Page load time < 3s
- [ ] Mobile traffic %
- [ ] SEO ranking for football tactics keywords

---

## 🔄 Maintenance Tasks

### Daily
- [ ] Monitor live scores API
- [ ] Check error logs
- [ ] Moderate reported content

### Weekly
- [ ] Update league tables
- [ ] Review user feedback
- [ ] Performance analysis

### Monthly
- [ ] Database backup verification
- [ ] Security updates
- [ ] Feature usage analysis
- [ ] User survey

---

## 💡 Future Ideas

- [ ] Podcast integration
- [ ] Live streaming tactical analysis
- [ ] Fantasy football integration
- [ ] Betting odds display (where legal)
- [ ] Manager career mode game
- [ ] Tactical quiz/challenges
- [ ] Coaching courses/tutorials
- [ ] Team/club official partnerships
- [ ] Multi-language support
- [ ] Regional leagues expansion

---

## 📝 Notes

- Follow Clean Architecture principles
- Use TypeScript for type safety
- Implement proper error handling
- Write tests for critical features
- Keep accessibility in mind (WCAG 2.1)
- Optimize for SEO from the start
- Plan for scalability
- Consider monetization strategy (ads, premium features)

---

---

## 🎯 **RECOMMENDED NEXT STEPS** (Updated 2025-10-06)

### ✅ **Current Status:**
- ✅ UI Development: **100% Complete** (16 pages + Global Layout)
- ✅ Supabase Project: **Initialized**
- ✅ Authentication & Profiles: **Schema Ready** (Multiple Profiles Architecture)
- ⏳ Database Schema: **In Progress** (Need to create content tables)

### 🔥 **Priority Tasks (Start Here):**

#### **STEP 1: Complete Database Schema** (Estimated: 3-4 hours)
Create migration file: `/supabase/migrations/20250828000002_soctact_content_tables.sql`

1. **Posts & Content Tables** (1-2 hours)
   - [ ] Create `posts` table with `profile_id` reference
   - [ ] Create `post_tags` table
   - [ ] Create `post_media` table
   - [ ] Add indexes for performance

2. **Social Features Tables** (1-2 hours)
   - [ ] Create `comments` table with nested replies support
   - [ ] Create `post_reactions` table
   - [ ] Create `comment_reactions` table
   - [ ] Create `follows` table
   - [ ] Create `bookmarks` table
   - [ ] Add indexes and unique constraints

3. **Notifications Table** (30 mins)
   - [ ] Create `notifications` table
   - [ ] Add indexes

#### **STEP 2: Row Level Security (RLS)** (Estimated: 2-3 hours)
Create migration file: `/supabase/migrations/20250828000003_soctact_rls_policies.sql`

- [ ] Enable RLS on all tables
- [ ] Create policies for `posts` (view, create, update, delete)
- [ ] Create policies for `comments`
- [ ] Create policies for `reactions`
- [ ] Create policies for `follows`
- [ ] Create policies for `bookmarks`
- [ ] Create policies for `notifications`

**Key RLS Rules:**
- Users can only create content with their **active profile_id**
- Users can only update/delete their own content
- Anyone can view published content

#### **STEP 3: Supabase Client Setup** (Estimated: 1-2 hours)
1. **Install Supabase Client**
   ```bash
   yarn add @supabase/supabase-js
   ```

2. **Create Supabase Client** (`/src/infrastructure/config/supabase.ts`)
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
   ```

3. **Setup Environment Variables** (`.env.local`)
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

#### **STEP 4: Authentication Integration** (Estimated: 2-3 hours)
1. **Connect Login/Register Forms** to Supabase Auth
   - Update `/src/presentation/presenters/auth/AuthPresenter.ts`
   - Implement `signIn()`, `signUp()`, `signOut()` methods
   - Handle JWT tokens

2. **Create Profile After Registration**
   - Auto-create first profile after user signs up
   - Set as active profile

3. **Setup Protected Routes** (middleware)
   - Check authentication status
   - Redirect to login if not authenticated

#### **STEP 5: Replace Mock Data (Start Small)** (Estimated: 4-6 hours)
1. **Posts Feed** (2-3 hours)
   - Create repository: `/src/infrastructure/repositories/PostRepository.ts`
   - Create use cases: `GetPostsUseCase`, `CreatePostUseCase`
   - Update `TacticsPresenter` to use real data
   - Test CRUD operations

2. **User Profile** (1-2 hours)
   - Create repository: `/src/infrastructure/repositories/ProfileRepository.ts`
   - Update profile pages to use real data
   - Implement profile switching (multiple profiles)

3. **Comments** (1-2 hours)
   - Create repository: `/src/infrastructure/repositories/CommentRepository.ts`
   - Update post detail page to use real comments
   - Implement nested replies

---

### 📋 **Development Workflow:**

**Week 1: Database Foundation**
- Day 1-2: Complete database schema (Steps 1-2)
- Day 3: Setup Supabase client (Step 3)
- Day 4-5: Authentication integration (Step 4)

**Week 2: Content Integration**
- Day 1-2: Posts CRUD with real data
- Day 3: User profiles with real data
- Day 4: Comments system
- Day 5: Testing & bug fixes

**Week 3: Social Features**
- Day 1: Reactions (upvote/downvote)
- Day 2: Follow system
- Day 3: Bookmarks
- Day 4: Notifications
- Day 5: Testing & polish

**Week 4: Football API Integration**
- Day 1-2: Connect Football API
- Day 3: Cache match data
- Day 4: Live scores updates
- Day 5: Testing & deployment

---

### 🎯 **Success Criteria:**
- ✅ Users can register and login with Supabase Auth
- ✅ Users can create multiple profiles and switch between them
- ✅ Users can create, edit, delete tactical analysis posts
- ✅ Users can comment on posts with nested replies
- ✅ Users can upvote/downvote posts and comments
- ✅ Users can follow other users
- ✅ Users can bookmark posts
- ✅ Live scores update automatically
- ✅ League tables show real data

---

**Last Updated:** 2025-10-06
**Version:** 1.1.0
**Status:** Backend Integration Phase
**Next Milestone:** Complete Database Schema & RLS Policies
