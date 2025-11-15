# SPEC Alpha Blueprint

## Step 1 — Combined Context Restatement
- **Current React prototype:** Vite + React + Tailwind SPA with a TikTok-inspired feed built from static `mockBuilds`. Routing exists for feed, build detail, comments, quotes, events, clubs, profile, and notifications, but every secondary route renders placeholder text without forms, data fetching, or guards.
- **Supabase footprint:** Generated browser client and SQL migrations define users, profiles, builds, shops, likes, saves, comments, quotes, events, and clubs with baseline RLS. None of these tables are queried or mutated by the app; auth is not initialized, and no storage buckets, messaging tables, or Stripe artifacts exist.
- **Missing capability:** No real-time feed, no build lists or mod catalog, no verified shop directory, no quote or messaging workflow, no project updates, no media upload/transcoding pipeline, no notifications, and no payment integration. React Query is mounted but unused; state resets rely on `window.location.reload()`.

## Step 2 — Master Mental Model
SPEC merges three industry blueprints plus its own differentiators into a single product vision:

### A. TikTok-Level Feed Patterns
- Vertical, snap-aligned cards occupying the viewport, autoplaying muted video by default.
- Predictive pre-fetch of the next two builds (media + metadata), virtualization, and infinite scroll with cursor pagination.
- Lightweight impression + dwell metrics captured client-side and flushed via batch RPC for ranking.
- Gesture-driven quick actions (like, save, share, view mod list) with haptics and contextual overlays.

### B. Instagram-Level Social Architecture
- Follows, likes, saves, threaded comments, direct messaging, and stories-like project updates.
- Denormalized fan-out notifications (write-once, read-many) with read/unread state and in-app toasts.
- Profile-driven discovery, allowing users to filter feed by followed creators or verified shops.
- Inbox model separating quotes, collaborations, and general DMs with typing indicators and delivery receipts.

### C. CarMax-Grade Vehicle Intelligence
- Structured VIN-style vehicle records (year/make/model/trim) augmented by performance stats and feature breakdowns.
- Trim-aware pricing, condition grading, mileage tracking, and ownership history to contextualize builds.
- Mod lists referencing SKU-level catalog items with part + labor cost, status, and install notes.
- AI-assisted spec completion (Edge Function invoking third-party data) to enrich incomplete submissions.

### D. SPEC Differentiators
- Verified shop marketplace with onboarding, document uploads, reviewer workflow, and Stripe Connect payouts.
- Quote request + shop reply threads linked to builds and mod lists, including media attachments and cost breakdowns.
- Project update timeline posts that surface in feed, notify followers, and tie into a build’s history.
- Supabase as the unified auth, data, storage, and realtime backbone with Edge Functions for business logic.

## Step 3 — Repo vs. Model Gap Analysis
| Required Feature | Current Implementation Status | Gap Summary |
| --- | --- | --- |
| Infinite TikTok-style feed | Static mock array rendered client-side | No Supabase data, pagination, video playback, personalization, or metrics |
| Supabase auth + profiles | Supabase client unused | Missing session management, profile bootstrap, follow graph, guards |
| Build details & vehicle specs | Route placeholders only | No vehicles table, no mod lists, no timeline, no media galleries |
| Project updates timeline | Not implemented | Requires `build_updates` table, UI timeline, notification fan-out |
| Comments, likes, saves | Local `useState` toggles | Needs tables, mutations, optimistic updates, RLS, notification triggers |
| Quote requests & messaging | Empty screens | Must design forms, message threads, Realtime subscriptions, Edge notifications |
| Verified shop directory | Absent | Need shop listing UI, verification workflow, admin tools, Stripe onboarding state |
| Build lists + mod items | Not modeled | Requires normalized schema, CRUD UI, dependency on catalog integration |
| Media storage & delivery | Local images only | Needs storage buckets, signed URLs, transcoding worker, responsive player |
| Notifications system | Icon only | Requires tables, triggers, in-app inbox, delivery rules, read tracking |
| Stripe monetization | Missing | Need Connect accounts, quote payment intents, webhook processors |
| Analytics & ranking | Missing | Requires impression capture, scoring jobs, and feed ranking RPC |

## Step 4 — Architecture Redesign
### 4.1 High-Level Architecture
- **Client:** React + Vite SPA organized by feature slices, leveraging React Query, Zustand (optional) for ephemeral UI state, and shadcn/ui components.
- **Backend:** Supabase Postgres with migrations managed in `supabase/migrations`, Storage for media, Realtime for messaging/feed invalidation, and Edge Functions for Stripe, ranking, notifications, and spec enrichment.
- **Services:** Stripe Connect (payments/payouts), third-party VIN/spec enrichment (DataOne, CarMD, etc.), optional telemetry (PostHog) for analytics.

### 4.2 Folder Structure
```
src/
  app/
    providers/ (AuthProvider, QueryProvider, ThemeProvider)
    router.tsx
    layouts/
    guards/
  features/
    feed/
      pages/
      components/
      hooks/
      api/
    builds/
    vehicles/
    mod-lists/
    updates/
    quotes/
    messaging/
    shops/
    notifications/
    auth/
    payments/
  lib/
    supabase/
      client.ts
      auth.ts
      rpc.ts
      storage.ts
    stripe/
      client.ts
      webhooks.ts
    realtime/
    analytics/
    utils/
  components/ui/
  components/common/
  styles/

supabase/
  migrations/
  seed/
  functions/
    quote-notify/
    feed-rank/
    stripe-webhook/
    shop-verify/
    spec-enrichment/

scripts/
  data-import/
  video-transcode/
```

### 4.3 Supabase Integration Layer
- Centralized `createBrowserClient` and server-side variant for Edge Functions.
- Strongly typed helpers (`rpc`, `select`, `insert`) with Zod validation at boundaries.
- `AuthProvider` listening to `supabase.auth.onAuthStateChange`, storing session in context, exposing profile query via React Query.
- RLS policies enforcing ownership, shop verification, and conversation privacy.

### 4.4 API Wrappers & Data Caching
- Feature-specific API modules returning typed DTOs (`features/feed/api/getFeedPage.ts`).
- Infinite queries for feed and messaging threads; standard queries for build detail, mod lists, shops.
- Mutations with optimistic cache updates for likes, saves, comments, quotes, and follow actions.
- Background revalidation triggered by Realtime channel messages.

### 4.5 Media & Storage Flow
- Buckets: `build-media`, `shop-logos`, `quote-attachments` with signed uploads via Edge Function token.
- Video uploads trigger `video-transcode` Edge Function -> queue -> worker (ffmpeg on Supabase Functions) -> store adaptive bitrates.
- Metadata persisted in `build_media` table with playback-ready URLs, aspect ratios, and durations.

### 4.6 Messaging Architecture
- Tables: `message_threads`, `thread_participants`, `messages`, `message_attachments`.
- Thread creation tied to quotes or direct DMs, with Realtime subscriptions per participant.
- Edge Function to broadcast notifications, enforce participant roles, and redact content if shop unverified.

### 4.7 Build Details + Mod Lists + Car Data
- `vehicles` table keyed by normalized make/model/trim.
- `builds` reference `vehicle_id`, include condition, mileage, pricing, and hero media reference.
- `build_mod_lists` + `build_mod_items` capture grouped modifications with cost and status.
- Build detail page composes sections: hero media, spec summary, mod list accordions, timeline updates, quote CTA, shop card.

### 4.8 Timeline & Updates
- `build_updates` table storing status text, stage, media references, metrics (likes/comments).
- Updates appear in feed snippets and dedicated build timeline view; new update triggers follower notifications.

### 4.9 Shop Verification Flow
- `shops` extended with `verification_status`, `documents`, `verification_notes`, `stripe_connect_id`.
- Onboarding wizard collects tax info, insurance, portfolio; Edge Function notifies reviewer.
- Admin panel (separate route) toggles status; verified shops gain badge + feed boost.

## Step 5 — Codebase Refactor Roadmap
1. **Stabilize foundation (Week 1):**
   - Remove mock feed data and `window.location.reload()` filter hack; scaffold Zustand store for feed filters.
   - Implement Supabase auth session bootstrap, profile query, and route guards.
   - Add `src/lib/supabase` with typed client + RPC utilities; wire React Query providers to use suspense-ready defaults.
2. **Model expansion (Weeks 2-3):**
   - Create migrations for vehicles, build_media, build_updates, build_mod_lists/items, message threads, notifications, follows.
   - Seed sample data for feed testing; add storage buckets configuration.
   - Replace placeholder routes with skeletal pages that call new APIs (feed detail, comments, quote form).
3. **Engagement & messaging (Weeks 4-5):**
   - Ship likes, saves, threaded comments with optimistic mutations and RLS adjustments.
   - Implement quote request form, thread creation, and messaging inbox UI using Supabase Realtime.
   - Add notification fan-out Edge Function, inbox page, and badge counts in top bar.
4. **Marketplace & monetization (Weeks 6-7):**
   - Build verified shop directory, detail view, and admin verification workflow.
   - Integrate Stripe Connect onboarding, payment intent creation for accepted quotes, and webhook handler storing transaction state.
   - Surface shop verification + payment eligibility in feed cards and quote flows.
5. **Media & analytics polish (Weeks 8-9):**
   - Implement media upload flow with transcoding pipeline and responsive video player.
   - Add feed prefetching, virtualization, dwell-time tracking, and ranking refresh Edge Function.
   - Instrument analytics via PostHog or similar, plus accessibility/performance audits.
6. **Hardening (Week 10):**
   - E2E QA, regression suite, load testing on feed RPC, finalize documentation, and prepare release checklist.

## Step 6 — TikTok → SPEC Feed Audit & Redesign
### Current State Audit
- Rendering limited to static cards with CSS snap scroll; no virtualization or preloading.
- Likes/saves mutate local state only; state lost on reload and no server sync.
- Scroll experience lacks momentum tuning, progress indicators, or context overlays.
- Media restricted to static images with no buffering or adaptive streaming.
- No recommendation algorithm, impression logging, or analytics surfaced to creators.

### Feed v2 Engineering Plan
1. **Data Access:** Supabase RPC `get_feed_page(user_id UUID, cursor TIMESTAMPTZ, filter TEXT)` returning builds + media + engagement counts; React Query `useInfiniteFeed` consuming RPC with 2-page prefetch.
2. **Media Layer:** Intersection Observer pauses/resumes playback; next/previous videos preloaded using `requestIdleCallback` and `<link rel="preload">`. Adaptive streaming via HLS playlists generated during transcoding.
3. **UI/UX:** `FeedCard` composed of `VideoPlayer`, `BuildMetaPanel`, `ActionRail`, `StageTracker`, and `ModTeaser`. Long-press surfaces quick actions; swiping reveals contextual menus.
4. **Interactions:** `useLikeBuild`, `useSaveBuild`, `useRecordView` mutations with optimistic updates, background sync, and offline queue.
5. **Ranking v1:** Weighted score = recency *0.4 + engagement *0.3 + follow affinity *0.2 + verification boost *0.1. Nightly Edge Function recalculates trending builds into materialized view; on-demand personalization uses user follows and interests.
6. **Metrics:** Impression, dwell time, completion rate, interaction type logged to `build_metrics` via batched RPC; aggregated dashboards for creators and shops.

## Step 7 — Instagram-Level Social Layer
### Core Tables & Indexing
- `profiles(id uuid primary key, username citext unique, avatar_url text, bio text, home_shop uuid, interests text[], created_at timestamptz)`.
- `follows(id bigserial, follower_id uuid, following_id uuid, created_at timestamptz, unique(follower_id, following_id))` with policies allowing self insert/delete.
- `build_likes(id bigserial, build_id uuid, user_id uuid, created_at timestamptz, unique(build_id, user_id))` + partial index for ranking.
- `build_saves(id bigserial, build_id uuid, user_id uuid, folder_id uuid null, created_at timestamptz)`.
- `comment_threads(id uuid, build_id uuid, root_comment_id uuid null, created_at timestamptz)`.
- `comments(id uuid, thread_id uuid, parent_id uuid null, user_id uuid, body text, media jsonb, created_at timestamptz, edited_at timestamptz)` with GIN index on `to_tsvector('english', body)`.
- `notifications(id uuid, recipient_id uuid, type text, payload jsonb, read_at timestamptz, created_at timestamptz)`; Edge Function performs fan-out on insert events (like, comment, follow, quote update).
- `message_threads(id uuid, subject_type text, subject_id uuid, last_message_at timestamptz)`.
- `thread_participants(thread_id uuid, user_id uuid, role text, last_read_at timestamptz, primary key(thread_id, user_id))`.
- `messages(id uuid, thread_id uuid, sender_id uuid, body text, attachments jsonb, created_at timestamptz, read_at timestamptz)` with Realtime enabled.

### Application Patterns
- React Query hooks (`useComments`, `useThread`, `useNotifications`) manage caching; optimistic writes update caches and schedule background revalidation.
- Fan-out notifications stored once per recipient; clients subscribe to `notifications` channel for badge updates.
- DM typing indicators emitted through Realtime presence channels keyed by `thread_id`.
- Activity digests generated daily via Edge Function summarizing unread notifications and quote updates.

## Step 8 — CarMax-Inspired Vehicle Data Layer
### Schema Extensions
- `vehicles(id uuid, vin text unique null, year smallint, make text, model text, trim text, drivetrain text, engine text, transmission text, body_style text, base_msrp numeric, curb_weight numeric, created_at timestamptz)`.
- `vehicle_specs(id uuid, vehicle_id uuid references vehicles, key text, value text, unit text)`.
- `vehicle_features(id uuid, vehicle_id uuid references vehicles, category text, name text, description text)`.
- `builds` augmented with `vehicle_id uuid references vehicles`, `condition_grade text`, `mileage integer`, `price_estimate_low numeric`, `price_estimate_high numeric`.
- `build_mod_lists(id uuid, build_id uuid references builds, title text, description text, total_estimated_cost numeric)`.
- `build_mod_items(id uuid, list_id uuid references build_mod_lists, part_number text, name text, brand text, category text, status text, labor_hours numeric, part_cost numeric, labor_cost numeric, notes text)`.
- `build_media(id uuid, build_id uuid references builds, type text, url text, storage_path text, aspect_ratio numeric, duration numeric, stage text, order_index integer)`.

### Sample Records
```json
{
  "vehicles": [{
    "id": "veh_2022_grsupra",
    "vin": null,
    "year": 2022,
    "make": "Toyota",
    "model": "GR Supra",
    "trim": "3.0 Premium",
    "drivetrain": "RWD",
    "engine": "3.0L Turbo I6",
    "transmission": "8AT",
    "body_style": "Coupe",
    "base_msrp": 54245,
    "curb_weight": 3374
  }],
  "build_mod_items": [{
    "id": "mod_titan_turbo",
    "list_id": "list_stage2",
    "part_number": "TT-9001",
    "name": "Titan Motorsports Turbo Upgrade",
    "brand": "Titan Motorsports",
    "category": "Forced Induction",
    "status": "installed",
    "labor_hours": 12,
    "part_cost": 3899,
    "labor_cost": 1500,
    "notes": "Requires upgraded fuel system"
  }]
}
```

### Display Strategy
- Feed cards surface headline stats (hp, torque, 0-60) with quick-access mod summary chips.
- Build detail page includes spec sheet (collapsible), mod list accordion with status filters, and price estimator comparing `price_estimate_*` to market comps.
- Quote forms pre-fill vehicle + mod context for shops; messaging threads reference individual mod items for clarification.
- Search filters leverage vehicle schema to enable VIN, make/model, trim, drivetrain, and condition filters.

## Step 9 — SPEC Alpha Blueprint Delivery
### Feature Pillars
1. **Immersive Feed:** Infinite, video-first feed with personalization, metrics, and quick actions.
2. **Build Intelligence:** Detailed vehicle specs, mod tracking, timelines, and update posts.
3. **Social Graph:** Follows, comments, likes, saves, notifications, and DMs powered by Supabase Realtime.
4. **Marketplace:** Verified shop directory, quote workflow, messaging, and Stripe-powered payments.
5. **Operational Backbone:** Edge Functions for ranking, notifications, Stripe webhooks, and spec enrichment; analytics instrumentation; production-ready folder structure.

### User Journeys
- **New Enthusiast:** Onboards via magic link → selects interests → receives personalized feed → saves favorite builds → requests quote → chats with shop.
- **Shop Owner:** Completes verification → showcases builds → receives quote requests → negotiates via messaging → sends Stripe payment link → tracks payouts.
- **Creator:** Uploads media + timeline updates → engages followers → tracks analytics in dashboard → monetizes via sponsorship or shop referrals.
- **Admin:** Reviews shop verification docs → monitors flagged content → manages feature flags and ranking tunables.

### Data & API Surface
- Supabase tables + RPC + Edge Functions as described above, with typed client wrappers.
- React Query hooks per feature ensuring cache consistency and optimistic UX.
- Background jobs scheduled via Supabase cron for ranking refresh, notification digests, and data enrichment.

### Execution Readiness
- Roadmap (Step 5) provides phased delivery with clear dependencies.
- Folder structure (Step 4.2) enables parallel workstreams across feed, marketplace, and data teams.
- Schema definitions (Steps 7 & 8) ready for migration authoring and Supabase studio configuration.

## Step 10 — Awaiting Implementation Signal
This blueprint encapsulates the audit, redesign, and execution plan. Implementation should begin only after receiving the explicit "Proceed to implementation" confirmation.

## Immediate Next Steps After Blueprint Approval
1. **Confirm ownership & staffing:** Assign leads for feed, marketplace, social, data, and platform tracks so the roadmap can be executed in parallel with clear accountability.
2. **Kick off Supabase integration sprint:** Begin Step 5.1 tasks—replace mock data with typed API layers, stand up the auth provider, and wire React Query caching so downstream features have a reliable foundation.
3. **Author foundational migrations:** Draft and review the new schema objects from Steps 7 and 8 (vehicles, mod lists, messaging, notifications) to unblock API and UI development in subsequent sprints.
4. **Define success metrics:** Document KPIs (feed engagement, quote conversion, shop response time) and instrumentation requirements before engineering proceeds, ensuring analytics hooks are built-in from the start.
5. **Schedule design + product alignment:** Hold working sessions with design and product stakeholders to validate critical user journeys (enthusiast, shop owner, creator, admin) against the blueprint before implementation begins.
