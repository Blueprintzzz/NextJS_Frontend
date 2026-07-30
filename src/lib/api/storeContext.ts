import { store } from '@/store/store';
import { setToken } from '@/store/slices/userSlice';
import {
  localStorageGet,
  localStorageSet,
  localStorageGetJSON,
} from '@/lib/utils/localStorage';

interface TfxAuth {
  accessToken?: string;
  refreshToken?: string;
}

interface RawUserData {
  token?: string;
  baseToken?: string;
  tokens?: { accessToken?: string };
  email?: string;
  [key: string]: unknown;
}

export function getCurrentUserData(): RawUserData {
  return localStorageGetJSON<RawUserData>('user') ?? {};
}

export function getAuthToken(): string | null {
  try {
    // 1. Redux store — primary source
    const state = store.getState();
    if (state.user.accessToken) return state.user.accessToken;
    if (state.user.token) return state.user.token;

    // 2. tfx_auth localStorage key (new auth flow)
    const tfxAuth = localStorageGetJSON<TfxAuth>('tfx_auth');
    if (tfxAuth?.accessToken) return tfxAuth.accessToken;

    // 3. Legacy 'user' key fallbacks
    const user = getCurrentUserData();
    if (user.token && user.token !== user.baseToken) return user.token;
    if (user.baseToken) return user.baseToken;
    if (user.tokens?.accessToken) return user.tokens.accessToken;

    return null;
  } catch {
    return null;
  }
}

export function updateActiveToken(newToken: string): void {
  try {
    // Update tfx_auth if present
    const raw = localStorageGet('tfx_auth');
    if (raw) {
      const parsed = JSON.parse(raw) as TfxAuth;
      parsed.accessToken = newToken;
      localStorageSet('tfx_auth', JSON.stringify(parsed));
    }
    store.dispatch(setToken(newToken));
  } catch {
    // best-effort
  }
}
