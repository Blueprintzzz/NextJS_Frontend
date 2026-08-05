'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/userSlice';
import { authApi } from '@/lib/api';

const ROLE_REDIRECTS: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  DRIVER: '/driver/dashboard',
  TOURIST: '/tourist/dashboard',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const registered = searchParams.get('registered') === 'true';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });

      localStorage.setItem('tfx_auth', JSON.stringify({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }));

      dispatch(setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }));

      const redirectTo = searchParams.get('redirect');
      if (redirectTo && response.user.role === 'TOURIST') {
        router.replace(redirectTo);
      } else {
        router.replace(ROLE_REDIRECTS[response.user.role] ?? '/bookings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 to-teal-900 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-sm text-center">
          <h1 className="text-4xl font-bold mb-4">GamanLk</h1>
          <p className="text-teal-200 text-lg leading-relaxed">
            Sri Lanka&apos;s smart tour booking platform. Discover destinations, book experiences, and travel with confidence.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            {['500+ Destinations', '200+ Drivers', '1000+ Experiences', '10K+ Happy Tourists'].map((s) => (
              <div key={s} className="bg-white/10 rounded-xl px-4 py-3 font-medium">{s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1 text-sm">Sign in to your GamanLk account</p>
          </div>

          {registered && (
            <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              Account created successfully. Please sign in.
            </p>
          )}

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-teal-600 font-semibold hover:text-teal-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
