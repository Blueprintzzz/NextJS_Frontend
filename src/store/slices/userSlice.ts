import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@/features/auth/types/auth.types';
import { localStorageGetJSON } from '@/lib/utils/localStorage';

interface TfxAuth {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface UserState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  // legacy compat — kept so AuthBootstrap / storeContext still compile
  token: string | null;
  role: string | null;
}

function rehydrate(): Partial<UserState> {
  const stored = localStorageGetJSON<TfxAuth>('tfx_auth');
  if (!stored?.accessToken) return {};
  return {
    user: stored.user,
    accessToken: stored.accessToken,
    refreshToken: stored.refreshToken,
    token: stored.accessToken,
    role: stored.user?.role ?? null,
    isAuthenticated: true,
  };
}

const initialState: UserState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  token: null,
  role: null,
  ...rehydrate(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken: string }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.accessToken;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
    },

    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },

    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    // legacy — kept for AuthBootstrap compatibility
    setUser(state, action: PayloadAction<Record<string, unknown>>) {
      const p = action.payload;
      if (p.role) state.role = p.role as string;
      if (p.email && state.user) state.user.email = p.email as string;
    },

    clearUser(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth, setToken, setUser, clearUser } = userSlice.actions;
export const logout = clearUser;
export default userSlice.reducer;
