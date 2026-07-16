'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreatePackageForm } from '@/features/package';

export default function CreatePackagePage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/packages">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Create Package</h1>
          <p className="text-sm text-gray-400">Build a new tour package step by step.</p>
        </div>
      </div>

      {/* Form */}
      <CreatePackageForm />
    </div>
  );
}
