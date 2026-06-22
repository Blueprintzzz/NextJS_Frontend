'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EditPackageForm } from '@/features/package';

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/packages">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Edit Package</h1>
      </div>
      <EditPackageForm packageId={id} />
    </div>
  );
}
