'use client';

import Link from 'next/link';
import { usePermissions } from '@/features/permissions';
import { sidebarGroups } from '../config/sidebarConfig';
import type { UserPermissions } from '@/features/permissions';
import { SidebarItem } from './SidebarItem';

/**
 * Determines whether a nav item should be shown.
 * - No canAccess defined → always visible (unrestricted item).
 * - canAccess defined + permissions loading → hidden (fail-closed).
 * - canAccess defined + permissions resolved → evaluate and show/hide.
 */
function isVisible(
  canAccess: ((p: UserPermissions | null) => boolean) | undefined,
  permissions: UserPermissions | null,
  loading: boolean
): boolean {
  if (!canAccess) return true;          // unrestricted
  if (loading) return false;            // fail-closed while loading
  return canAccess(permissions);        // evaluate
}

export function FeatureSidebar() {
  const { permissions, loading } = usePermissions();

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-gray-200 bg-white overflow-y-auto">
      {/* Branding */}
      <div className="px-4 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">My App</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-6">
        {sidebarGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            isVisible(item.canAccess, permissions, loading)
          );
          // Hide the entire group if all its items are hidden
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {visibleItems.map((item) => (
                  <SidebarItem key={item.href} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
