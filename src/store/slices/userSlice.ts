import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorageGet, localStorageSetJSON } from '@/lib/utils/localStorage';

export interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImage: string | null;
  role: string | null;
  department: string | null;
  location: string | null;
  points: number | null;
}

function readPersistedUser(): Record<string, unknown> {
  const raw = localStorageGet('user');
  if (!raw) return {};
  try { return JSON.parse(raw) as Record<string, unknown>; } catch { return {}; }
}

function persistUser(partial: Record<string, unknown>): void {
  localStorageSetJSON('user', { ...readPersistedUser(), ...partial });
}

const initialState: UserState = {
  token: null,
  isAuthenticated: false,
  userId: null,
  firstName: null,
  lastName: null,
  email: null,
  profileImage: null,
  role: null,
  department: null,
  location: null,
  points: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    clearUser: () => initialState,

    refreshCurrentUserData: (
      state,
      action: PayloadAction<{
        points: number;
        role: string;
        department: string;
        location: string;
        profileImage: string;
      }>
    ) => {
      state.points = action.payload.points;
      state.role = action.payload.role;
      state.department = action.payload.department;
      state.location = action.payload.location;
      state.profileImage = action.payload.profileImage;
      persistUser(action.payload);
    },
  },
});

export const { setUser, setToken, clearUser, refreshCurrentUserData } = userSlice.actions;
export const logout = clearUser;
export default userSlice.reducer;
