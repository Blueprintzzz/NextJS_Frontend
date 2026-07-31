'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EditPackageForm } from '@/features/package';

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/packages">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
          <p className="text-sm text-gray-400">Update tour package details step by step.</p>
        </div>
      </div>
      <EditPackageForm packageId={id} backHref="/admin/packages" />
    </div>
  );
}
