'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setAuth, clearAuth } from '@/store/slices/userSlice';
import { localStorageGetJSON } from '@/lib/utils/localStorage';
import { decodeTokenPayload } from '../utils/authUtils';
import type { AuthUser } from '../types/auth.types';

interface TfxAuth {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

function isTokenValid(token: string): boolean {
  try {
    const payload = decodeTokenPayload(token);
    if (!payload?.exp) return false;
    return (payload.exp as number) * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorageGetJSON<TfxAuth>('tfx_auth');
    const token = stored?.accessToken ?? '';

    if (!token || !isTokenValid(token)) {
      dispatch(clearAuth());
      router.replace('/login');
      return;
    }

    dispatch(setAuth({
      user: stored!.user,
      accessToken: stored!.accessToken,
      refreshToken: stored!.refreshToken,
    }));
    setChecked(true);
  }, [dispatch, router]);

  // Periodic token validation every 5 minutes
  useEffect(() => {
    if (!checked) return;
    const interval = setInterval(() => {
      const stored = localStorageGetJSON<TfxAuth>('tfx_auth');
      if (!stored?.accessToken || !isTokenValid(stored.accessToken)) {
        dispatch(clearAuth());
        router.replace('/login');
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checked, dispatch, router]);

  // Cross-tab logout
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tfx_auth' && !e.newValue) {
        dispatch(clearAuth());
        router.replace('/login');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [dispatch, router]);

  if (!checked) return null;
  return <>{children}</>;
}
