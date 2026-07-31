'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReviewList, PackageReviewSummary } from '@/features/review';

export default function PackageReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/packages">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Package Reviews</h1>
      </div>
      <div className="space-y-6">
        <PackageReviewSummary packageId={id} />
        <ReviewList packageId={id} />
      </div>
    </div>
  );
}
