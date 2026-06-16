'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, setToken, setOrgs, setCurrentOrg, clearUser } from '@/store/slices/userSlice';
import { localStorageGetJSON } from '@/lib/utils/localStorage';
import { decodeTokenPayload } from '../utils/authUtils';

interface PersistedUser {
  token?: string;
  tokens?: { accessToken?: string };
  baseToken?: string;
  email?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  orgs?: unknown[];
  organizations?: unknown[];
  currentOrg?: { orgId: string; name: string; role: string };
  [key: string]: unknown;
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
  const isAuthenticated = useAppSelector((s) => s.user.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const userData = localStorageGetJSON<PersistedUser>('user');
    const token = userData?.tokens?.accessToken ?? userData?.token ?? userData?.baseToken ?? '';

    if (!token || !isTokenValid(token)) {
      dispatch(clearUser());
      router.replace('/login');
      return;
    }

    dispatch(setUser(userData as Record<string, unknown>));
    dispatch(setToken(token));

    const orgs = userData?.orgs ?? userData?.organizations ?? [];
    if (Array.isArray(orgs) && orgs.length) dispatch(setOrgs(orgs as never[]));
    if (userData?.currentOrg) dispatch(setCurrentOrg(userData.currentOrg));

    setChecked(true);
  }, [dispatch, router]);

  // Periodic token validation every 5 minutes
  useEffect(() => {
    if (!checked) return;
    const interval = setInterval(() => {
      const userData = localStorageGetJSON<PersistedUser>('user');
      const token = userData?.tokens?.accessToken ?? userData?.token ?? '';
      if (!token || !isTokenValid(token)) {
        dispatch(clearUser());
        router.replace('/login');
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checked, dispatch, router]);

  // Cross-tab logout
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'user' && !e.newValue) {
        dispatch(clearUser());
        router.replace('/login');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [dispatch, router]);

  if (!checked) return null;
  return <>{children}</>;
}
