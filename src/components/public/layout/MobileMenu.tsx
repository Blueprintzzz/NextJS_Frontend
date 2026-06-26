'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Info, MapPin, Compass, Package, Mail, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  onSearchClick?: () => void;
}

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about-us', label: 'About Us', icon: Info },
  { href: '/destinations', label: 'Destinations', icon: MapPin },
  { href: '/experiences', label: 'Experiences', icon: Compass },
  { href: '/tours', label: 'Tours', icon: Package },
  { href: '/contact-us', label: 'Contact Us', icon: Mail },
];

export function MobileMenu({ onSearchClick }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            {onSearchClick && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSearchClick();
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}