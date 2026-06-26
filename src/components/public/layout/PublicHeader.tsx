'use client';

import Link from 'next/link';
import { Search, User, Compass } from 'lucide-react';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';

export function PublicHeader() {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Compass className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-base text-gray-900 tracking-tight">Sri Way</span>
              <span className="font-semibold text-xs text-teal-600 tracking-widest uppercase">Tours</span>
            </div>
          </Link>
          <Navigation />
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}