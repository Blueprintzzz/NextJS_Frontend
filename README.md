# Next.js 14 App Router Framework Skeleton

A clean Next.js 14 starter demonstrating:
- App Router route groups with auth guard
- Redux Toolkit + React Query dual-layer state
- Feature module pattern
- Centralised API layer with header injection and 401 retry
- Auth bootstrap + org selection gate
- Fail-closed permission system

---

## Getting Started

```bash
npm install
cp .env.local.template .env.local
# Fill in NEXT_PUBLIC_API_URL and Cognito values
npm run dev
```
---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default: `http://localhost:3001`) |
| `NEXT_PUBLIC_APP_ENV` | `development` / `production` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | AWS Cognito pool ID |
| `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID` | AWS Cognito client ID |

`NEXT_PUBLIC_` variables are bundled into the client. Never put secrets here. `.env.local` is gitignored.

---

## Provider Tree

```
RootLayout (Server Component)
  └── Providers ('use client' — single client boundary)
        ├── StoreProvider          → Redux Toolkit global client state
        ├── QueryClientProvider    → TanStack React Query v5 server state
        ├── ThemeProvider          → next-themes
        └── TooltipProvider        → Radix UI
              └── Sonner           → toast notifications
```

**Rule:** `Providers.tsx` is composition-only. Never import feature modules there.

---

## Route Groups

| Group | Purpose | Auth |
|---|---|---|
| `(public)` | `/login`, `/register` | None |
| `(protected)` | All authenticated pages | AuthBootstrap → OrgSelectionGate |

### Adding a new route group

1. Create `src/app/(group-name)/layout.tsx`
2. For auth-gated groups, wrap with `<AuthBootstrap>` from `@/features/auth`
3. Add pages under `src/app/(group-name)/<route>/page.tsx`

---

## Auth Flow

```
(protected)/layout.tsx
  └── AuthBootstrap
        1. Reads localStorage 'user'
        2. Validates JWT (structure + expiry)
        3. Fail → router.replace('/login')
        4. Pass → dispatches setUser / setToken / setOrgs / setCurrentOrg to Redux
        5. Starts 5-min periodic token check (useAuthValidation)
        6. Cross-tab logout via window.storage event
        └── OrgSelectionGate
              - currentOrg in Redux → pass through
              - 1 org from API → auto-switch via POST /auth/switch-org
              - >1 org → shows org picker UI
              - 0 orgs → "no organisations" message
```

**Do not modify** `AuthBootstrap.tsx` or `OrgSelectionGate.tsx`. They are framework.

---

## API Layer

Located in `src/lib/api/`.

```
apiRequest(endpoint, options)
  ├── buildJsonHeaders() injects:
  │     Authorization: Bearer <token>
  │     x-user-email, x-selected-org-id, x-org-id, x-organization-id
  ├── 401/403 → retry once with baseToken from localStorage
  ├── Non-OK → throws ApiError(message, status)
  └── 204 / empty → returns null
```

### Read pattern (never throws)

```typescript
export async function getThings(orgId: string): Promise<Thing[]> {
  try {
    const raw = await apiRequest(`/things?orgId=${orgId}`);
    return Array.isArray(raw) ? (raw as Thing[]) : [];
  } catch {
    return [];
  }
}
```

### Write pattern (always throws)

```typescript
export async function createThing(payload: CreateThingPayload): Promise<Thing> {
  return apiRequest('/things', {
    method: 'POST',
    body: JSON.stringify(payload),
  }) as Promise<Thing>;
}
```

### Adding a new domain

1. Create `src/lib/api/domains/my-feature.domain.ts` — raw `apiRequest` calls
2. Export it from `src/lib/api/index.ts`

---

## Redux vs React Query

| Concern | Tool | Where |
|---|---|---|
| Auth token, current user, current org | Redux (`userSlice`) | `src/store/slices/userSlice.ts` |
| All server data (lists, records, etc.) | React Query | `features/<name>/hooks/` |

**On org switch**, call `queryClient.clear()` before dispatching `setCurrentOrg` to prevent stale cross-org data:

```typescript
queryClient.clear();
dispatch(setCurrentOrg(newOrg));
```

### Query key convention

Keys must always be namespaced arrays:

```
['feature', 'subkey', orgId]
['example', 'items', orgId]
['permissions', orgId]
```

---

## Feature Module Pattern

Every feature lives in `src/features/<name>/` and follows this structure:

```
features/<name>/
├── api/          reads return [] on failure; writes throw
├── hooks/        useQuery / useMutation wrappers ('use client')
├── components/   UI components ('use client')
├── utils/        pure functions only — no hooks, no side effects
├── types/        TypeScript interfaces
└── index.ts      barrel — only public surface exported
```

**Pages import only from the barrel:**

```typescript
import { MyList, useMyData } from '@/features/my-feature';
```

### Step-by-step: adding a new feature

1. `mkdir src/features/my-feature/{api,hooks,components,utils,types}`
2. Define types in `types/my-feature.types.ts`
3. Write raw domain call in `src/lib/api/domains/my-feature.domain.ts`
4. Write read/write wrappers in `api/my-feature.api.ts`
5. Write `hooks/useMyFeatureData.ts` (useQuery) and `hooks/useCreateMyFeature.ts` (useMutation with optimistic update)
6. Write `components/MyFeatureList.tsx` (`'use client'`)
7. Export everything from `index.ts`
8. Create `src/app/(protected)/my-feature/page.tsx`
9. Add a nav item to `src/features/sidebar/config/sidebarConfig.ts`

### Optimistic update pattern

```typescript
onMutate: async (newItem) => {
  await queryClient.cancelQueries({ queryKey: ['feature', 'items', orgId] });
  const snapshot = queryClient.getQueryData(['feature', 'items', orgId]);
  queryClient.setQueryData(['feature', 'items', orgId], (old: Item[]) => [
    ...old,
    { ...newItem, id: 'temp', createdAt: new Date().toISOString() },
  ]);
  return { snapshot };
},
onError: (_err, _vars, context) => {
  queryClient.setQueryData(['feature', 'items', orgId], context?.snapshot);
},
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ['feature', 'items', orgId] });
},
```

---

## Permission System

### How it works

```typescript
// In any protected component or page:
const { permissions, loading } = usePermissions();

if (loading) return null;           // fail-closed — hidden while loading
if (!canDoSomething(permissions)) return null;
```

- `loading` starts `true` — gates return `false` (hidden) until permissions resolve
- Admin users automatically receive all permissions (no API call)
- On org switch, permissions re-fetch automatically (new org-scoped token)

### Adding permission helpers

1. Add a constant to `src/features/permissions/constants.ts`:
   ```typescript
   export const PERM_MY_RESOURCE_VIEW = 'my_resource:view';
   ```
2. Add a helper to `src/features/permissions/utils.ts`:
   ```typescript
   export const canViewMyResource = (p: UserPermissions | null) =>
     hasPermission(p, 'my_resource:view');
   ```
3. Re-export from `src/features/permissions/index.ts`
4. Use in a nav item:
   ```typescript
   { label: 'My Resource', href: '/my-resource', icon: MyIcon, canAccess: canViewMyResource }
   ```

---

## Sidebar

Add nav groups to `src/features/sidebar/config/sidebarConfig.ts`:

```typescript
import { Home } from 'lucide-react';
import { canViewMyResource } from '@/features/permissions';

export const sidebarGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      {
        label: 'My Resource',
        href: '/my-resource',
        icon: Home,
        canAccess: canViewMyResource,   // omit for unrestricted items
      },
    ],
  },
];
```

Groups with all items hidden are not rendered. Items without `canAccess` are always visible.

---

## Scripts

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```
