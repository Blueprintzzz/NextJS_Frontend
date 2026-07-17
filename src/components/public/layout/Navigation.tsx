'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, MapPin, Compass, Package, Mail, Car } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about-us', label: 'About Us', icon: Info },
  { href: '/destinations', label: 'Destinations', icon: MapPin },
  { href: '/experiences', label: 'Experiences', icon: Compass },
  { href: '/tours', label: 'Tours', icon: Package },
  { href: '/vehicles', label: 'Vehicles', icon: Car },
  { href: '/contact-us', label: 'Contact Us', icon: Mail },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive ? 'text-teal-600' : 'text-gray-600'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}