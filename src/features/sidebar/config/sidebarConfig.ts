import type { LucideIcon } from 'lucide-react';
import { Calendar, PlusCircle, Car, MapPin, Map, LayoutGrid, Mail, Package, Star, MessageSquare, ShieldCheck, UserCircle } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const sidebarGroups: NavGroup[] = [
  {
    label: 'Bookings',
    items: [
      { label: 'My Bookings', href: '/bookings', icon: Calendar },
      { label: 'Create Booking', href: '/bookings/create', icon: PlusCircle },
    ],
  },
  {
    label: 'Packages',
    items: [
      { label: 'All Packages', href: '/packages', icon: Package },
      { label: 'Featured Packages', href: '/packages/featured', icon: Star },
      { label: 'Create Package', href: '/packages/create', icon: PlusCircle },
    ],
  },
  {
    label: 'Vehicles',
    items: [
      { label: 'Browse Vehicles', href: '/vehicles', icon: Car },
      { label: 'Admin Management', href: '/admin/vehicles', icon: Car },
    ],
  },
  {
    label: 'Destinations',
    items: [
      { label: 'Explore Map', href: '/map', icon: Map },
      { label: 'All Districts', href: '/destinations', icon: MapPin },
      { label: 'Categories', href: '/categories', icon: LayoutGrid },
    ],
  },
  {
    label: 'Reviews',
    items: [
      { label: 'All Reviews', href: '/reviews', icon: Star },
      { label: 'My Reviews', href: '/account/reviews', icon: UserCircle },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
      { label: 'Reviews', href: '/admin/reviews', icon: ShieldCheck },
      { label: 'Experiences', href: '/admin/experiences', icon: Star },
    ],
  },
  {
    label: 'Support',
    items: [
      { label: 'Contact Us', href: '/contact', icon: Mail },
    ],
  },
];
