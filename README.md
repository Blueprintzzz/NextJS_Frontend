# sberry V2

Employee engagement and workforce management platform.  
Full migration from V1 (React + Vite SPA) to V2 (Next.js 14 App Router).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Migration Passes](#migration-passes)
- [Feature Modules](#feature-modules)
- [API Layer](#api-layer)
- [State Management](#state-management)
- [Permissions System](#permissions-system)
- [Newsfeed Module (Deep Dive)](#newsfeed-module-deep-dive)
- [RnR Module (Deep Dive)](#rnr-module-deep-dive)
- [Settings Module (Deep Dive)](#settings-module-deep-dive)
- [TAA Module (Deep Dive)](#taa-module-deep-dive)
- [Deferred Features](#deferred-features)
- [Known Gaps vs V1](#known-gaps-vs-v1)
- [Scripts](#scripts)

---

## Overview

sberry is a multi-tenant employee engagement platform covering:

- Newsfeed (posts, reactions, comments, announcements)
- Rewards & Recognition (nominations, wallet, points, charity)
- Time & Attendance (roster, timesheets, leave, unavailability, time clock)
- Settings (users, departments, locations, permissions, leave types)
- Surveys

**V1** was a monolithic React + Vite SPA (`src/pages/newsfeed.tsx` alone was ~1,400 lines).  
**V2** is a Next.js 14 App Router application with a modular feature-based architecture, React Query for server state, and Redux for global client state.

---

## Tech Stack

| Layer | V1 | V2 |
|---|---|---|
| Framework | React 18 + Vite | Next.js 14 (App Router) |
| Language | TypeScript | TypeScript 5 |
| Styling | Tailwind CSS | Tailwind CSS 3 + tailwindcss-animate |
| Server state | useEffect + useState | TanStack React Query v5 |
| Client state | Redux Toolkit | Redux Toolkit 2 |
| Icons | react-icons | lucide-react |
| Toasts | sonner | sonner |
| Animation | framer-motion + Lottie | @lottiefiles/dotlottie-react + react-confetti |
| UI primitives | Radix UI (full) | Radix UI (slot, tooltip, toast only) |
| Auth | AWS Cognito + localStorage | AWS Cognito + localStorage |

**No new dependencies** are added during migration passes. All V2 UI is built with Tailwind only.

---

## Project Structure

```
sberry-v2/
├── public/
│   └── img/                    # Static assets (avatars, cards, lottie files)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (admin)/            # Admin route group
│   │   ├── (protected)/        # Auth-gated route group
│   │   │   ├── newsfeed/
│   │   │   ├── rnr/
│   │   │   ├── settings/
│   │   │   ├── taa/
│   │   │   │   ├── roster/
│   │   │   │   ├── roster-daily/
│   │   │   │   ├── timesheets/
│   │   │   │   ├── leave/
│   │   │   │   └── unavailability/
│   │   │   └── surveys/
│   │   └── (public)/           # Login / Register
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Providers.tsx   # Root provider composition
│   │   │   └── ErrorBoundary.tsx
│   │   └── ui/                 # Shared UI primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       └── tooltip.tsx
│   ├── features/
│   │   ├── auth/               # AuthBootstrap, OrgSelectionGate, hooks, utils
│   │   ├── newsfeed/           # Full newsfeed feature module
│   │   ├── rnr/                # Rewards & Recognition feature module
│   │   ├── settings/           # Settings feature module
│   │   ├── taa/                # Time & Attendance feature module
│   │   ├── permissions/        # Permission hooks, utils, constants
│   │   └── sidebar/            # FeatureSidebar + config
│   ├── lib/
│   │   └── api/                # Typed API layer
│   │       ├── domains/        # Per-domain API objects
│   │       ├── request.ts      # Core fetch wrapper
│   │       ├── headers.ts      # Auth + org header injection
│   │       └── index.ts        # Public API exports
│   ├── store/                  # Redux store
│   │   ├── slices/
│   │   │   └── userSlice.ts    # Auth, org, points state
│   │   └── store.ts
│   └── types/
├── .env.local.template         # Environment variable template
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Backend API running (default: `http://localhost:3001`)

### Installation

```bash
git clone https://github.com/sberryApp/sberryFrontendV1.git
cd sberryFrontendV1
git checkout nextjs-v2
npm install
cp .env.local.template .env.local
# Edit .env.local with your real values
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

---

## Environment Variables

Copy `.env.local.template` to `.env.local` and fill in:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your_user_pool_client_id
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_GIPHY_API_KEY=your_giphy_api_key
```

> `NEXT_PUBLIC_` variables are bundled into the client. Never put secrets here.  
> `.env.local` is gitignored. `.env.local.template` (no real values) is committed.

---

## Architecture

### Server / Client boundary

- `src/app/layout.tsx` — Server Component root
- `src/components/shared/Providers.tsx` — Single `'use client'` boundary at root
- All feature components that need browser APIs are individually marked `'use client'`
- `window` access is always guarded with `typeof window !== 'undefined'`
- Heavy animation libs loaded via `next/dynamic({ ssr: false })`

### Route groups

| Group | Path | Purpose |
|---|---|---|
| `(public)` | `/login`, `/register` | Unauthenticated pages |
| `(protected)` | `/newsfeed`, `/rnr/*`, `/settings/*`, `/taa/*` | Auth + org gated |
| `(admin)` | `/admin/*` | Admin panel, org bypass |

### Auth flow

```
Request → (protected)/layout.tsx
        → AuthBootstrap (validates JWT, hydrates Redux)
        → OrgSelectionGate (ensures currentOrg in Redux)
        → Page renders
```

1. `AuthBootstrap` reads `localStorage.user`, validates JWT structure + expiry
2. On failure → clears localStorage → redirects to `/login`
3. On success → dispatches `setUser`, `setToken`, `setOrgs`, `setCurrentOrg` to Redux
4. `OrgSelectionGate` handles single-org auto-select, multi-org picker, super-admin bypass
5. `useAuthValidation` runs a 5-minute periodic token check
6. Cross-tab logout synced via `window.addEventListener('storage')`

### Feature module pattern

Every feature follows the same structure:

```
features/<name>/
├── api/          # Safe API wrappers (reads never throw, writes throw)
├── hooks/        # React Query hooks (useQuery / useMutation)
├── components/   # UI components ('use client')
├── utils/        # Pure functions (no hooks, no side effects)
└── index.ts      # Barrel export — only public surface exported
```

Pages import **only** from the barrel: `import { X } from '@/features/<name>'`.

---

## Migration Passes

| Pass | Scope | Status |
|---|---|---|
| 1–12 | Scaffold, providers, auth, API layer, Redux, React Query, org switching, permissions, login, register | ✅ |
| 13A–13N | Newsfeed (posts, reactions, comments, composer, GIFs, announcements, widgets, gift modal) | ✅ |
| 14 | System hardening audit | ✅ |
| 14A | Critical fixes (query key namespacing, hook violations, stale closures) | ✅ |
| 15 | RnR module (nominations, wallet, points history, charity, events, analytics) | ✅ |
| 16 | Settings module (users, departments, locations, permissions, leave types, profile, billing) | ✅ |
| 17A | TAA module foundation (API wrappers, hooks, read-only components, barrel, page wiring) | ✅ |
| 17A-FIX | TAA hardening (name resolution, org-scoped query keys, error states, unavailability delete, PK parsing) | ✅ |
| 17B | Roster redesign architecture | ✅ |
| 17B-IMPL | Roster CRUD (shift create/edit/delete/publish, bulk publish, optimistic updates) | ✅ |
| 17B-FIX | Roster hardening (partial bulk rollback, server conflict surfacing, temp shift UX, dept cascade) | ✅ |
| 17C-A | Timesheets foundation (date-scoped hooks, shared lookup hooks, useTimesheetView composite hook) | ✅ |
| 17C-B | Timesheets UI rebuild (date range controls, groupBy, filters, grouped table, inline editing, leave badge) | ✅ |
| 17C-C | TAA consolidation — LeaveTable rebuild, UnavailabilityTable rebuild, Timesheets hardening, TaaShared primitives | ✅ |
| 17C-C-FIX | TAA critical fixes (editMap data loss, multi-select filters, document button, past-date validation, fragment keys, group reset UX, leave items invalidation, validation consistency) | ✅ |
| 17C-C-FIX-2 | Ship blockers resolved (past-date validation in UnavailabilityFormModal, orgId guard in edit modal, duplicate ci===co validation removed, dead ctx cast removed) | ✅ |
| 17D | Timesheets new features — delete (optimistic + confirm dialog), no-show marking, CSV export, insights panel, multi-select labels on all three tables | ✅ |
| 17E-MICRO | Pre-deploy fixes — delete dialog stays open until mutation resolves, saveClock invalidation moved to onSettled | ✅ |

---

## Feature Modules

### `features/auth`

| File | Purpose |
|---|---|
| `AuthBootstrap.tsx` | JWT validation, Redux hydration, cross-tab sync |
| `OrgSelectionGate.tsx` | Org selection flow (auto-select, multi-org picker, super-admin bypass) |
| `useAuthValidation.ts` | 5-minute periodic token validation |
| `useOrgSwitcher.ts` | POST /auth/switch-org, cache clear, Redux update |
| `authUtils.ts` | JWT decode, expiry check, localStorage helpers |

### `features/permissions`

| File | Purpose |
|---|---|
| `usePermissions.ts` | Loads + caches user permissions, re-loads on org switch |
| `utils.ts` | 40+ `can*` helpers covering all modules |
| `loader.ts` | `getCurrentUserPermissions` — admin fast-path + API fetch |
| `constants.ts` | `ALL_ADMIN_PERMISSIONS`, `PERM_*` string constants |

All permission gates are **fail-closed**: return `false` while `loading === true`.

### `features/sidebar`

- `FeatureSidebar.tsx` — renders permission-gated nav groups
- `sidebarConfig.ts` — `NavItem[]` with optional `canAccess` functions
- Groups: Main, Rewards & Recognition, Time & Attendance, Surveys, Settings

### `features/newsfeed`

See [Newsfeed Module (Deep Dive)](#newsfeed-module-deep-dive).

### `features/rnr`

See [RnR Module (Deep Dive)](#rnr-module-deep-dive).

### `features/settings`

See [Settings Module (Deep Dive)](#settings-module-deep-dive).

### `features/taa`

See [TAA Module (Deep Dive)](#taa-module-deep-dive).

---

## API Layer

Located in `src/lib/api/`.

### Core

| File | Purpose |
|---|---|
| `request.ts` | `apiRequest()` — fetch wrapper with 401/403 baseToken retry |
| `headers.ts` | Injects `Authorization`, `x-user-email`, `x-selected-org-id`, `x-org-id` |
| `config.ts` | `API_BASE_URL` from `NEXT_PUBLIC_API_URL` |
| `errors.ts` | `ApiError` class with status code |
| `storeContext.ts` | Reads token + orgId from Redux store outside React |

### Domain objects

```
domains/
├── auth.ts          — login, register, profile, switch-org
├── users.ts         — getById, getActive, update, redeemGiftCard
├── posts.ts         — create, getByOrg, delete, comments
├── announcements.ts — getAll, acknowledgments
├── companyValues.ts — getByOrg
├── nominations.ts   — nominationProgramsApi, nominationsApi
├── organizations.ts — getAll, create, switch
├── departments.ts   — departmentsApi, locationsApi
├── permissions.ts   — getByUser
├── points.ts        — create, getByUser
├── leave.ts         — leaveApi, leaveTypesApi
└── taa.ts           — timesheetsApi, timeAttendanceApi, unavailabilityApi, timeClockApi
```

### API wrapper discipline

All feature API wrappers follow this pattern (enforced across all modules):

```typescript
// Reads — never throw, return [] or null on failure
export async function getThings(orgId: string): Promise<Thing[]> {
  try {
    const raw = await domainApi.getAll(orgId);
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// Writes — let throw so useMutation onError fires
export async function createThing(payload: CreateThingPayload): Promise<Thing> {
  return domainApi.create(payload);
}
```

---

## State Management

### Redux (global client state)

| Slice | State |
|---|---|
| `userSlice` | `token`, `userId`, `firstName`, `lastName`, `email`, `profileImage`, `role`, `points`, `currentOrg`, `orgs` |
| `departmentSlice` | Department color mappings |

Key actions: `setUser`, `setToken`, `setCurrentOrg`, `switchOrganization`, `refreshCurrentUserData`, `clearUser`

### React Query (server state)

Global config in `Providers.tsx`:

```typescript
new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, retry: false }
  }
})
```

**Query key namespacing convention:**

```
['newsfeed', 'posts', orgId]
['newsfeed', 'reactions', postId]
['newsfeed', 'comments', postId]
['rnr', 'programs', orgId]
['rnr', 'nominations', orgId]
['rnr', 'wallet', userId]
['settings', 'users', orgId]
['settings', 'locations', orgId]
['settings', 'departments', orgId]
['taa', 'roster', orgId, startDate, endDate]
['taa', 'timesheets', orgId, startDate, endDate]
['taa', 'leave', 'requests', orgId, startDate, endDate]
['taa', 'unavailability', orgId, startDate, endDate]
['users', 'active', orgId]
['permissions', orgId, userId]
```

On org switch, `queryClient.clear()` is called by `useOrgSwitcher` to prevent stale cross-org data.

---

## Permissions System

```typescript
import { usePermissions, canCreatePost, canViewWallet } from '@/features/permissions';

const { permissions, loading } = usePermissions();

if (loading) return null;           // fail-closed
if (!canCreatePost(permissions)) return null;
```

Available helpers (40+):

```
Newsfeed:    canCreatePost, canDeleteOwnPost, canSendPoints, canCreateAnnouncement
RnR:         canViewWallet, canCreateNomination, canViewFullNominations
Roster:      canViewFullRoster, canViewMyRoster, canCreateFullRoster, canCreateMyRoster
             canUpdateFullRoster, canUpdateMyRoster, canDeleteFullRoster, canDeleteMyRoster
Timesheets:  canViewFullTimesheets, canViewMyTimesheets, canUpdateFullTimesheets, canUpdateMyTimesheets
Leave:       canViewFullLeave, canViewMyLeave, canCreateFullLeave, canCreateMyLeave
             canUpdateFullLeave, canUpdateMyLeave, canDeleteFullLeave, canDeleteMyLeave
Unavail:     canViewFullUnavailability, canViewMyUnavailability, canCreateFullUnavailability
             canUpdateFullUnavailability, canDeleteFullUnavailability
Settings:    canViewUsers, canCreateUsers, canUpdateUsers
```

---

## Newsfeed Module (Deep Dive)

Located at `src/features/newsfeed/`.

### Hooks

| Hook | Query key | Purpose |
|---|---|---|
| `usePosts` | `['newsfeed', 'posts', orgId]` | Fetch posts, sorted newest-first |
| `useCreatePost` | — | Mutation, invalidates posts |
| `useDeletePost` | — | Mutation, invalidates posts |
| `useAuthor` | `['users', userId]` | Resolve userId → name + avatar |
| `useAnnouncements` | `['newsfeed', 'announcements']` | Fetch + deduplicate + filter acknowledged |
| `useReactions` | `['newsfeed', 'reactions', postId]` | Optimistic toggle with rollback |
| `useComments` | `['newsfeed', 'comments', postId]` | Optimistic create with rollback |
| `useActiveUsers` | `['newsfeed', 'users', 'active']` | All active users |
| `useCompanyValues` | `['newsfeed', 'companyValues', orgId]` | Active company values |
| `useUserEvents` | `['newsfeed', 'userEvents']` | Birthdays + anniversaries |

### Key components

- `PostList` — filtered post list, owns `activeFilter` state
- `PostCard` — author, content, chips, media, reactions, comments
- `PostComposerModal` — @tagging, #values, GIF search, points chips
- `AnnouncementsCarousel` — CSS-only, 5s auto-rotate, pause on hover
- `WalletWidget` + `RedeemPointsModal` + `GiftModal` — points balance, redeem, Lottie animation
- `NominationsWidget`, `CalendarEventsWidget`, `PerksWidget`, `CharityWidget`

### Optimistic update pattern

```
onMutate  → cancelQueries → snapshot → setQueryData (optimistic)
onError   → restore snapshot
onSettled → invalidateQueries
```

---

## RnR Module (Deep Dive)

Located at `src/features/rnr/`.

### Routes

| Route | Component |
|---|---|
| `/rnr/dashboard` | Points summary, recent activity |
| `/rnr/nominations` | Nomination programs list |
| `/rnr/nominations/create` | Create nomination form |
| `/rnr/nominations/list/[programId]` | Nominations for a program |
| `/rnr/nominations/program/[programId]` | Program detail |
| `/rnr/wallet` | Points wallet + transaction history |
| `/rnr/pointshistory` | Full points history |
| `/rnr/events` | Birthdays + anniversaries |
| `/rnr/analytics` | Points analytics |
| `/rnr/charity` | Charity giving |
| `/rnr/announcements` | Announcements list |

### Key hooks

- `useNominationPrograms` — active programs, permission-gated
- `useNominations` — nominations by program
- `useWallet` — points balance + transaction history
- `usePointsHistory` — full history with date filtering

---

## Settings Module (Deep Dive)

Located at `src/features/settings/`.

### Routes

| Route | Component |
|---|---|
| `/settings/users` | User list + invite |
| `/settings/users/create` | Create user form |
| `/settings/departments` | Department CRUD |
| `/settings/locations` | Location CRUD |
| `/settings/permissions` | Role + permission management |
| `/settings/leavetypes` | Leave type CRUD |
| `/settings/profile` | User profile edit |
| `/settings/billing` | Billing info |
| `/settings/points-allocation` | Points allocation config |
| `/settings/organization-switcher` | Org switcher UI |

### Query keys

```
['settings', 'users', orgId]
['settings', 'departments', orgId]
['settings', 'locations', orgId]
['settings', 'permissions', orgId]
['settings', 'leaveTypes', orgId]
```

---

## TAA Module (Deep Dive)

Located at `src/features/taa/`.

### Routes

| Route | Component | Status |
|---|---|---|
| `/taa/roster` | `RosterWeeklyView` | Full CRUD |
| `/taa/roster-daily` | `RosterDailyView` | Full CRUD |
| `/taa/timesheets` | `TimesheetsTable` | Full (inline edit, groupBy, date range, multi-select filters) |
| `/taa/leave` | `LeaveTable` | Full (date range, groupBy, multi-select filters, approve/reject/create/edit/delete, document view) |
| `/taa/unavailability` | `UnavailabilityTable` | Full (date range, groupBy, multi-select filters, approve/reject/create/edit/delete) |

### API wrappers (`api/taaApi.ts`)

All reads return `[]` on failure. All writes throw.

Key functions: `getShiftsByOrgAndDateRange`, `createShift`, `updateShift`, `deleteShift`, `getTimesheetsByOrg`, `updateTimesheet`, `getLeaveRequestsByOrg`, `getLeaveItemsByOrg`, `createLeaveRequest`, `updateLeaveRequest`, `deleteLeaveRequest`, `getUnavailabilityByOrgAndDateRange`, `createUnavailability`, `updateUnavailabilityStatus`, `getAllUsers`, `getLocationsByOrg`, `getDepartmentsByOrg`

### Hooks

| Hook | Query key | Purpose |
|---|---|---|
| `useRoster` | `['taa', 'roster', orgId, start, end]` | Shifts by date range |
| `useRosterMutations` | — | create/update/delete/publish/bulkPublish with optimistic updates |
| `useRosterUsers` | `['users', 'active', orgId]` | Users + nameMap for roster |
| `useRosterLocations` | `['settings', 'locations', orgId]` | Locations for roster |
| `useRosterDepartments` | `['settings', 'departments', orgId]` | Departments for roster |
| `useShiftForm` | — | Pure local form state, validation, reset |
| `useTimesheets` | `['taa', 'timesheets', orgId, start, end]` | Date-scoped timesheets |
| `useTimesheetView` | composite | Enriched + filtered + grouped timesheet rows |
| `useTimesheetMutations` | — | approve/reject/no-show/delete + inline clock edit with optimistic patch; submitDelete and submitClockEdit accept optional onSuccess callbacks |
| `useLeaveView` | composite | Enriched + filtered + grouped leave rows |
| `useUnavailabilityView` | composite | Enriched + filtered + grouped unavailability rows |
| `useTaaUsers` | `['users', 'active', orgId]` | Shared user lookup (shared cache with roster) |
| `useTaaLocations` | `['taa', 'locations', orgId]` | Shared location lookup |
| `useTaaDepartments` | `['taa', 'departments', orgId]` | Shared department lookup |
| `useLeaveRequests` | `['taa', 'leave', 'requests', orgId, start, end]` | Leave requests |
| `useLeaveItems` | `['taa', 'leave', 'items', orgId, start, end]` | Leave items |
| `useLeaveTypes` | `['taa', 'leave', 'types', orgId]` | Leave types |
| `useUnavailability` | `['taa', 'unavailability', orgId, start, end]` | Unavailability records |

### Roster architecture

The roster uses a **modal-based CRUD** pattern (no drag-and-drop — `@dnd-kit` not installed):

```
RosterWeeklyView (container)
├── RosterGrid (pure presentational table)
│   └── ShiftCell (per-shift chip with action menu)
├── ShiftFormModal (create/edit — cascade location→dept→employee)
├── BulkPublishBar (sticky bottom bar, partial failure handling)
└── Delete confirm Dialog

RosterDailyView (container)
├── RosterDayGrid (24-hour grid, colSpan strategy)
├── ShiftFormModal
├── BulkPublishBar
└── Delete confirm Dialog
```

**Optimistic update flow:**
```
onMutate  → cancelQueries → snapshot → inject optimistic shift (temp-* id)
onSuccess → replace temp id with real shiftId from server
onError   → restore snapshot, surface server error message
onSettled → invalidateQueries({ queryKey: ['taa', 'roster', orgId] })
```

**Bulk publish:** sequential batches of 5 via `Promise.allSettled`. Only failed shifts revert to draft — succeeded shifts stay published. Error message shows `"X published, Y failed"`.

**Overlap detection:** `findOverlappingShift()` pure function in `utils/validation.ts`. Runs client-side on every form change via `useMemo`. Handles overnight shifts correctly.

### Timesheets architecture

Powered by `useTimesheetView` composite hook:

```
useTimesheetView({ orgId, startDate, endDate, groupBy, filters })
│
├── useTimesheets → timesheetsApi.getByDateRange (server-scoped)
├── useLeaveRequests + useLeaveItems → leave overlay per row
├── useTaaUsers / useTaaLocations / useTaaDepartments → enrichment
│
├── [useMemo] buildLeaveMap → Map<userId::date, LeaveRecord>
├── [useMemo] enrich → EnrichedTimesheetRow[] (name, location, dept, duration, leave)
├── [useMemo] filter → apply userIds / locationIds / departmentIds / status
└── [useMemo] group → GroupedTimesheet[] sorted newest-first
```

`TimesheetsTable` owns only UI state (date range, groupBy, filter selections, inline edit map). All data computation is delegated to the hook.

### Leave + Unavailability architecture (PASS 17C-C)

Both tables follow the same composite hook pattern as Timesheets:

```
useLeaveView({ orgId, startDate, endDate, groupBy, filters })
│
├── useLeaveRequests → leaveApi.getLeaveRequestsByOrg (date-scoped)
├── useTaaUsers / useTaaLocations / useTaaDepartments → enrichment
│
├── [useMemo] userDefaultMap → userId → { locationId, departmentId }
├── [useMemo] enrich → EnrichedLeaveRow[] (name, location, dept, dates, docURL)
├── [useMemo] filter → apply userIds / locationIds / departmentIds / status
└── [useMemo] group → GroupedLeave[] sorted newest-first
```

`useUnavailabilityView` follows the identical pattern over `useUnavailability`.

### Shared TAA UI primitives (`components/TaaShared.tsx`)

All three tables use identical shared components to ensure visual consistency:

| Export | Purpose |
|---|---|
| `GroupHeader` | Collapsible group row with label, count, optional total hours |
| `SkeletonRows` | Animate-pulse skeleton, configurable column count |
| `StatusBadge` | Handles both uppercase (timesheets) and lowercase (leave/unavail) status keys |
| `ErrorBanner` | Red banner with warning icon |
| `DateRangeRow` | Row 1 controls: viewMode select, prev/next nav, custom date inputs, groupBy select |
| `computeRange` | Pure function: viewMode + anchor → `{ start, end }` |
| `shiftAnchor` | Pure function: advance anchor by viewMode delta |
| `todayStr` | Returns today as `YYYY-MM-DD` |

### Utils

| File | Purpose |
|---|---|
| `utils/date.ts` | `toDateString`, `fromDateString`, `startOfWeekUTC`, `addDaysUTC`, `formatTime`, `formatDate` — UTC-safe, no external libs |
| `utils/time.ts` | `parseTimeToMinutes`, `calcShiftHours`, `isoToTimeString`, `timeStringToISO`, `formatHours` — integer-minute arithmetic |
| `utils/validation.ts` | `validateShiftTimes`, `validateDateRange`, `validateRequired`, `findOverlappingShift` — pure functions |

---

## Deferred Features

| Feature | Reason deferred |
|---|---|
| Roster drag-and-drop | `@dnd-kit` not installed — no new dependencies policy |
| Roster shift copy/paste | Requires DnD context — PASS 17D |
| Roster insights panel | Low priority — PASS 17D |
| Roster no-show marking | PASS 17D |
| Timesheets leave + timeclock overlay | Requires timeclock backend integration |
| Timesheets export to Excel | CSV export shipped in 17D; XLSX deferred (no new dependencies) |
| Leave document upload (backend) | Requires backend upload endpoint |
| Leave/Unavailability cascading location→dept filter | Future pass |
| ErrorBoundary on TAA pages | Future pass |
| Roster virtualization (100+ employees) | Future pass |
| Points sending in post creation | Requires FlipCoinButton (framer-motion) |
| Comment delete | No `deleteComment` endpoint in V2 API |
| Admin feature modules | Low priority |

---

## Known Gaps vs V1

| Gap | Impact | Priority |
|---|---|---|
| Roster read-only (no DnD) | Managers must use modal for all shift operations | Medium — modal is functional |
| Timesheets unbounded fetch when no date range | Fixed in 17C-A (date-scoped via `getByDateRange`) | Resolved |
| Leave/Unavailability missing group by + view modes | Fixed in 17C-C (date range, groupBy, multi-select filters) | Resolved |
| Past-date validation in UnavailabilityFormModal | Users can create records with past dates | ✅ Resolved in 17C-C-FIX |
| No ErrorBoundary on TAA pages | Full page crash on render error | Medium — PASS 17D |
| `usePermissions` not in React Query cache | Multiple concurrent fetches per page | Medium |
| `post.shareCount` vs `post.commentCount` | Verify backend field name | High |

---

## Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

---

## Branch

This codebase lives on the `nextjs-v2` branch of:  
`https://github.com/sberryApp/sberryFrontendV1`

V1 code is preserved on the `Dev` and `Dev-backup-react` branches.
