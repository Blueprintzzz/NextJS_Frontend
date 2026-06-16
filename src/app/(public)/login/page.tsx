'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setUser, setToken, setOrgs } from '@/store/slices/userSlice';
import { authApi } from '@/lib/api';
import { isSuperAdmin, decodeTokenPayload } from '@/features/auth/utils/authUtils';
import { localStorageSetJSON } from '@/lib/utils/localStorage';

interface LoginResponseData {
  tokens?: { accessToken?: string };
  token?: string;
  role?: string;
  email?: string;
  isSuperAdmin?: boolean;
  organizations?: unknown[];
  currentOrg?: { orgId: string; name: string; role: string };
  orgId?: string;
  [key: string]: unknown;
}

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const router   = useRouter();
  const dispatch = useAppDispatch();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = (await authApi.login({ email, password })) as
        | { data?: LoginResponseData }
        | LoginResponseData;

      const data: LoginResponseData =
        (response as { data?: LoginResponseData }).data ?? (response as LoginResponseData);

      const token = data.tokens?.accessToken ?? data.token ?? '';
      const payload = token ? decodeTokenPayload(token) : null;

      const userDataWithBaseToken = {
        ...data,
        baseToken: token,
        token,
        tokens: data.tokens ?? { accessToken: token },
        isAuthenticated: true,
      };

      localStorageSetJSON('user', userDataWithBaseToken);
      dispatch(setUser(userDataWithBaseToken));
      if (token) dispatch(setToken(token));
      if (Array.isArray(data.organizations)) dispatch(setOrgs(data.organizations as never[]));

      const superAdmin = isSuperAdmin(
        { role: data.role, email: data.email, isSuperAdmin: data.isSuperAdmin },
        payload
      );

      router.replace(superAdmin ? '/admin/orgs' : '/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Sign in</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          No account?{' '}
          <a href="/register" className="text-gray-900 underline">Register</a>
        </p>
      </div>
    </div>
  );
}
