'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';
import { usePackageReviews } from '../hooks/useReviews';

interface Props {
  packageId: string;
}

export function ReviewList({ packageId }: Props) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePackageReviews(packageId, page);

  if (isError) return <p className="text-sm text-red-600">Failed to load reviews.</p>;

  return (
    <div className="space-y-4">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse" />)
      ) : (
        <>
          {data.data.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No reviews yet.</p>}
          {data.data.map((r) => <ReviewCard key={r.id} review={r} />)}
          {data.pages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Page {data.page} of {data.pages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
