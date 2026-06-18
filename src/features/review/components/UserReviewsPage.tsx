'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';
import { ApproveReviewModal } from './ApproveReviewModal';
import { useReviews, useDeleteReview } from '../hooks/useReviews';
import type { Review, ReviewStatus } from '../types/review.types';

const STATUS_OPTIONS: ReviewStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

export function UserReviewsPage() {
  const [status, setStatus] = useState<ReviewStatus | undefined>();
  const [moderating, setModerating] = useState<Review | null>(null);
  const { data, isLoading } = useReviews({ status });
  const deleteMutation = useDeleteReview();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStatus(undefined)} className={`px-3 py-1 rounded-full text-sm ${!status ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>All</button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1 rounded-full text-sm ${status === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>{s}</button>
        ))}
      </div>

      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse" />)
      ) : (
        <div className="space-y-4">
          {data.data.length === 0 && <p className="text-gray-400 text-center py-10">No reviews found.</p>}
          {data.data.map((r) => (
            <div key={r.id} className="relative">
              <ReviewCard review={r} />
              <div className="absolute top-3 right-3 flex gap-2">
                {r.status === 'PENDING' && (
                  <Button size="sm" variant="outline" onClick={() => setModerating(r)}>Moderate</Button>
                )}
                <Button size="sm" variant="ghost" className="text-red-500" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(r.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ApproveReviewModal review={moderating} onClose={() => setModerating(null)} />
    </div>
  );
}
