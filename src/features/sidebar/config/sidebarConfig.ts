import type { LucideIcon } from 'lucide-react';
import { Calendar, PlusCircle } from 'lucide-react';

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
];
