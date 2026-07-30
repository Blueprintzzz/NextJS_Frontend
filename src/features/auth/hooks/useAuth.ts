'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuth } from '@/store/slices/userSlice';
import { authApi } from '@/lib/api';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken, refreshToken, isAuthenticated } = useAppSelector(
    (state) => state.user
  );

  async function logout() {
    if (accessToken) {
      await authApi.logout(accessToken, refreshToken ?? undefined).catch(() => {});
    }
    localStorage.removeItem('tfx_auth');
    dispatch(clearAuth());
    window.location.href = '/login';
  }

  return { user, accessToken, refreshToken, isAuthenticated, logout };
}
