'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/userSlice';
import { localStorageGetJSON } from '@/lib/utils/localStorage';
import type { AuthUser } from '@/features/auth/types/auth.types';

interface TfxAuth {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = localStorageGetJSON<TfxAuth>('tfx_auth');
    if (stored?.accessToken) {
      dispatch(setAuth({
        user: stored.user,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
      }));
    }
  }, [dispatch]);

  return null;
}
