'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth';
import { SidebarItem } from './SidebarItem';
import {
  touristGroup,
  driverGroup,
  driverVehiclesGroup,
  bookingsGroup,
  packagesGroup,
  destinationsGroup,
  reviewsGroup,
  adminGroup,
} from '../config/sidebarConfig';
import type { NavGroup } from '../config/sidebarConfig';

const ROLE_BADGE: Record<string, string> = {
  TOURIST: 'bg-teal-100 text-teal-700',
  DRIVER: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-purple-100 text-purple-700',
};

function getGroupsForRole(role: string | undefined): NavGroup[] {
  switch (role) {
    case 'TOURIST':
      return [touristGroup, bookingsGroup, destinationsGroup, reviewsGroup];
    case 'DRIVER':
      return [driverGroup, packagesGroup, driverVehiclesGroup, destinationsGroup];
    case 'ADMIN':
      return [adminGroup, destinationsGroup, reviewsGroup];
    default:
      return [];
  }
}

export function FeatureSidebar() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const role = user?.role;
  const { logout } = useAuth();

  if (!role) {
    router.replace('/login');
    return null;
  }

  const groups = getGroupsForRole(role);

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-gray-200 bg-white overflow-y-auto">
      {/* Header — app name + user info */}
      <div className="px-4 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 mb-3">
          <span className="text-base font-semibold text-gray-900">GamanLk</span>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-800 truncate">
            {user.firstName} {user.lastName}
          </p>
          <span
            className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${ROLE_BADGE[role] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {role.charAt(0) + role.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <SidebarItem key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
