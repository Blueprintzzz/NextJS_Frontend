import type { LucideIcon } from 'lucide-react';
import { Calendar, PlusCircle } from 'lucide-react';
import type { UserPermissions } from '@/features/permissions';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * Optional permission gate.
   * Absent → always visible.
   * Present → called with resolved UserPermissions (or null while loading).
   * Fail-closed: null permissions → false → item hidden.
   */
  canAccess?: (p: UserPermissions | null) => boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Add your nav groups here.
 * Each item can be gated with canAccess from @/features/permissions.
 *
 * Example:
 *   import { Home } from 'lucide-react';
 *   import { canDoSomething } from '@/features/permissions';
 *
 *   { label: 'Main', items: [
 *     { label: 'Home', href: '/example', icon: Home, canAccess: canDoSomething },
 *   ]}
 */
export const sidebarGroups: NavGroup[] = [
  {
    label: 'Bookings',
    items: [
      { label: 'My Bookings', href: '/bookings', icon: Calendar },
      { label: 'Create Booking', href: '/bookings/create', icon: PlusCircle },
    ],
  },
];
