'use client';

import Link from 'next/link';
import { sidebarGroups } from '../config/sidebarConfig';
import { SidebarItem } from './SidebarItem';

export function FeatureSidebar() {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-gray-200 bg-white overflow-y-auto">
      <div className="px-4 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">My App</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-6">
        {sidebarGroups.map((group) => (
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
    </aside>
  );
}
