'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewStats } from './ReviewStats';
import { StarRating } from './StarRating';
import { usePackageReviews, usePackageReviewStats } from '../hooks/useReviews';

interface Props {
  packageId: string;
}

export function PackageReviewSummary({ packageId }: Props) {
  const { data: statsData } = usePackageReviewStats(packageId);
  const { data: reviewsData } = usePackageReviews(packageId);

  const latestThree = reviewsData.data.slice(0, 3);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Guest Reviews</h3>
          <Link href={`/packages/${packageId}/reviews`} className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {statsData && <ReviewStats stats={statsData} />}
        <div className="space-y-3">
          {latestThree.map((r) => (
            <div key={r.id} className="border-t border-gray-100 pt-3 first:border-0 first:pt-0">
              <div className="flex items-center gap-2 mb-1">
                <StarRating value={r.rating} readonly size="sm" />
                <span className="text-xs text-gray-500">{r.userName}</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{r.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
