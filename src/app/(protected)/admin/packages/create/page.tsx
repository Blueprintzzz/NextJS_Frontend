'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreatePackageForm } from '@/features/package';

export default function CreatePackagePage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/packages">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Package</h1>
          <p className="text-sm text-gray-400">Build a new tour package step by step.</p>
        </div>
      </div>
      <CreatePackageForm />
    </div>
  );
}
