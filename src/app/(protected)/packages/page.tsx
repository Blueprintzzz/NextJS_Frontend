'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageList } from '@/features/package';

export default function PackagesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tour Packages</h1>
        <Link href="/packages/create">
          <Button>+ New Package</Button>
        </Link>
      </div>
      <PackageList />
    </div>
  );
}
