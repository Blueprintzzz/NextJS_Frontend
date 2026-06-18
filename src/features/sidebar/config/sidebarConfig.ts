import type { LucideIcon } from 'lucide-react';
import { Calendar, PlusCircle, Car, MapPin, Map, LayoutGrid, Mail } from 'lucide-react';

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
    label: 'Support',
    items: [
      { label: 'Contact Us', href: '/contact', icon: Mail },
    ],
  },
];
