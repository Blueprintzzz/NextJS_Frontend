import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  localStorageGet,
  localStorageSetJSON,
} from '@/lib/utils/localStorage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrgBranding {
  logoUrl?: string;
  primaryColor?: string;
}

export interface Organization {
  orgId: string;
  name: string;
  role: 'Admin' | 'Manager' | 'User' | string;
  subscribedModules?: string[];
  branding?: OrgBranding;
}

export interface CurrentOrg {
  orgId: string;
  name: string;
  role: 'Admin' | 'Manager' | 'User' | string;
  subscribedModules?: string[];
  branding?: OrgBranding;
}

export interface UserState {
  // Authentication
  token: string | null;
  isAuthenticated: boolean;

  // User info
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImage: string | null;
  role: string | null;
  department: string | null;
  location: string | null;
  points: number | null;

  // Organization context
  currentOrg: CurrentOrg | null;
  orgs: Organization[];

  // Legacy support — kept for backward compat with hooks that read selectedOrgId
  selectedOrgId: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the persisted user blob from localStorage (client-only). */
function readPersistedUser(): Record<string, unknown> {
  const raw = localStorageGet('user');
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Merge a partial update into the persisted user blob. */
function persistUser(partial: Record<string, unknown>): void {
  const current = readPersistedUser();
  localStorageSetJSON('user', { ...current, ...partial });
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

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
  currentOrg: null,
  orgs: [],
  selectedOrgId: null,
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

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

    setCurrentOrg: (state, action: PayloadAction<CurrentOrg>) => {
      // Enrich with branding from orgs array if not provided
      let currentOrg = action.payload;
      if (!currentOrg.branding) {
        const match = state.orgs.find((o) => o.orgId === action.payload.orgId);
        if (match?.branding) {
          currentOrg = { ...action.payload, branding: match.branding };
        }
      }

      state.currentOrg = currentOrg;
      state.selectedOrgId = currentOrg.orgId;

      // SSR-safe localStorage write
      persistUser({ currentOrg, orgId: currentOrg.orgId });
    },

    setOrgs: (state, action: PayloadAction<Organization[]>) => {
      state.orgs = action.payload;

      // SSR-safe localStorage write
      persistUser({ orgs: action.payload });
    },

    setSelectedOrgId: (state, action: PayloadAction<string>) => {
      state.selectedOrgId = action.payload;
      const org = state.orgs.find((o) => o.orgId === action.payload);
      if (org) {
        state.currentOrg = org;
      }
    },

    clearUser: () => initialState,

    clearSelectedOrgId: (state) => {
      state.selectedOrgId = null;
      state.currentOrg = null;
    },

    switchOrganization: (
      state,
      action: PayloadAction<{
        token: string;
        orgId: string;
        role: string;
        subscribedModules?: string[];
        currentOrg?: CurrentOrg;
      }>
    ) => {
      state.token = action.payload.token;

      if (action.payload.currentOrg) {
        state.currentOrg = action.payload.currentOrg;
        state.selectedOrgId = action.payload.currentOrg.orgId;
      } else {
        let org = state.orgs.find((o) => o.orgId === action.payload.orgId);

        if (org) {
          if (action.payload.subscribedModules) {
            org = { ...org, subscribedModules: action.payload.subscribedModules };
            state.orgs = state.orgs.map((o) =>
              o.orgId === org!.orgId ? org! : o
            );
          }
          state.currentOrg = org;
          state.selectedOrgId = action.payload.orgId;
        } else {
          state.currentOrg = {
            orgId: action.payload.orgId,
            name: `Organization ${action.payload.orgId}`,
            role: action.payload.role,
            subscribedModules: action.payload.subscribedModules ?? [],
            branding: undefined,
          };
          state.selectedOrgId = action.payload.orgId;
        }
      }

      // SSR-safe localStorage write
      persistUser({
        token: action.payload.token,
        orgId: action.payload.orgId,
        currentOrg: state.currentOrg,
        orgs: state.orgs,
      });
    },

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

      // SSR-safe localStorage write
      persistUser({
        points: action.payload.points,
        role: action.payload.role,
        department: action.payload.department,
        location: action.payload.location,
        profileImage: action.payload.profileImage,
      });
    },
  },
});

export const {
  setUser,
  setToken,
  setCurrentOrg,
  setOrgs,
  setSelectedOrgId,
  clearUser,
  clearSelectedOrgId,
  switchOrganization,
  refreshCurrentUserData,
} = userSlice.actions;

// Alias kept for V1 compatibility
export const logout = clearUser;

export default userSlice.reducer;
