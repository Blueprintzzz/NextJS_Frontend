'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, LogOut } from 'lucide-react';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '@/features/auth';

export function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function AuthButtons() {
    // Render the unauthenticated state on the server and on first paint
    // so SSR HTML always matches the client's initial render.
    if (!mounted) {
      return (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </div>
      );
    }
    if (isAuthenticated && user) {
      return (
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            {user.firstName}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
        <Link
          href="/register"
          className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <Image
                src="/img/logo.jpeg"
                alt="Gamanalk"
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-base text-gray-900 tracking-tight">Gamanalk</span>
              <span className="font-semibold text-xs text-teal-600 tracking-widest uppercase">Tours</span>
            </div>
          </Link>
          <Navigation />
        </div>

        <div className="flex items-center gap-4">
          <button
            suppressHydrationWarning
            className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <AuthButtons />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
