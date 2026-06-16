/**
 * storeContext.ts
 *
 * ISOLATED SINGLETON STORE ACCESS FOR THE API LAYER.
 *
 * This is the ONLY file in src/lib/api/ that imports the Redux store.
 * All other API files that need token or org context import from here,
 * not from '@/store' directly.
 *
 * Why isolation matters:
 *   V1 imported `store` at the top level of api.ts, which meant every
 *   consumer of api.ts transitively depended on the Redux singleton.
 *   In Next.js, if a Server Component ever imported from the API layer,
 *   the store would be instantiated on the server — a subtle bug.
 *
 *   By containing the store import here, we have a single place to
 *   swap out the store access pattern in Phase 2 (e.g. replace with
 *   cookie-based session reads for server-side API calls).
 *
 * CLIENT-ONLY: This module must only be called from client-side code.
 *   The functions below read from localStorage and the Redux store,
 *   both of which are browser-only. They are safe because all API
 *   calls in Phase 1 originate from client components.
 */

import { store } from '@/store/store';
import { setToken } from '@/store/slices/userSlice';
import {
  localStorageGet,
  localStorageSet,
  localStorageGetJSON,
} from '@/lib/utils/localStorage';

// ---------------------------------------------------------------------------
// User data helpers
// ---------------------------------------------------------------------------

interface RawUserData {
  token?: string;
  baseToken?: string;
  tokens?: { accessToken?: string };
  email?: string;
  currentOrg?: { orgId?: string };
  orgId?: string;
  [key: string]: unknown;
}

/** Read the raw user blob from localStorage. */
export function getCurrentUserData(): RawUserData {
  return localStorageGetJSON<RawUserData>('user') ?? {};
}

// ---------------------------------------------------------------------------
// Token resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the current auth token.
 *
 * Priority order (mirrors V1 getAuthToken exactly):
 *   1. Redux store state.user.token
 *   2. localStorage 'user'.token  (if different from baseToken)
 *   3. localStorage 'userData'.token (if different from baseToken)
 *   4. localStorage 'userData'.baseToken
 *   5. localStorage 'user'.baseToken
 *   6. localStorage 'user'.tokens.accessToken
 *   7. localStorage 'userData'.tokens.accessToken
 */
export function getAuthToken(): string | null {
  try {
    // 1. Redux store — primary source
    const state = store.getState();
    if (state.user.token) return state.user.token;

    // 2–7. localStorage fallbacks
    const user = getCurrentUserData();
    const userData = localStorageGetJSON<RawUserData>('userData') ?? {};

    if (user.token && user.token !== user.baseToken) return user.token;
    if (userData.token && userData.token !== userData.baseToken) return userData.token;
    if (userData.baseToken) return userData.baseToken;
    if (user.baseToken) return user.baseToken;
    if (user.tokens?.accessToken) return user.tokens.accessToken;
    if (userData.tokens?.accessToken) return userData.tokens.accessToken;

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Org ID resolution
// ---------------------------------------------------------------------------

/** Sentinel values that indicate no real org is selected. */
const INVALID_ORG_VALUES = new Set(['(active)', 'active']);

/**
 * Resolve the currently selected organisation ID.
 *
 * Priority order (mirrors V1 getSelectedOrgId exactly):
 *   1. Redux store state.user.currentOrg.orgId
 *   2. Redux store state.user.selectedOrgId
 *   3. localStorage 'user'.currentOrg.orgId
 *   4. localStorage 'user'.orgId
 *   5. localStorage 'selectedOrgId' key
 */
export function getSelectedOrgId(): string | null {
  try {
    const state = store.getState();

    const currentOrgId = state.user.currentOrg?.orgId;
    if (currentOrgId && !INVALID_ORG_VALUES.has(currentOrgId)) return currentOrgId;

    const selectedOrgId = state.user.selectedOrgId;
    if (selectedOrgId && !INVALID_ORG_VALUES.has(selectedOrgId)) return selectedOrgId;

    const userData = getCurrentUserData();
    if (userData.currentOrg?.orgId) return userData.currentOrg.orgId;
    if (userData.orgId) return userData.orgId;

    const lsOrgId = localStorageGet('selectedOrgId');
    if (lsOrgId && !INVALID_ORG_VALUES.has(lsOrgId)) return lsOrgId;

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Token update (used by retry logic)
// ---------------------------------------------------------------------------

/**
 * Update the active token in both localStorage and the Redux store.
 * Called by the 401/403 retry path when falling back to baseToken.
 */
export function updateActiveToken(newToken: string): void {
  try {
    const raw = localStorageGet('user');
    const userData = raw ? (JSON.parse(raw) as RawUserData) : {};
    userData.token = newToken;
    localStorageSet('user', JSON.stringify(userData));
    store.dispatch(setToken(newToken));
  } catch {
    // Silently ignore — best-effort token update
  }
}
