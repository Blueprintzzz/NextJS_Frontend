import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-gray-900">
            Sri Way Tours
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            <Link href="/login" className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Sri Way Tours. All rights reserved.
      </footer>
    </div>
  );
}
