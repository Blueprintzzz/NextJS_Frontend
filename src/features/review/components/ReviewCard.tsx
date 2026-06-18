'use client';

import Image from 'next/image';
import { ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { useMarkHelpful } from '../hooks/useReviews';
import type { Review } from '../types/review.types';

interface Props {
  review: Review;
}

export function ReviewCard({ review }: Props) {
  const markHelpful = useMarkHelpful();

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {review.userAvatar ? (
              <Image src={review.userAvatar} alt={review.userName} width={32} height={32} className="rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                {review.userName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{review.userName}</p>
              <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <StarRating value={review.rating} readonly size="sm" />
        </div>

        <div>
          <p className="font-medium text-gray-900 text-sm">{review.title}</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.description}</p>
        </div>

        {review.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {review.images.map((src, i) => (
              <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image src={src} alt={`Review image ${i + 1}`} fill className="object-cover" sizes="64px" />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => markHelpful.mutate(review.id)}
          disabled={markHelpful.isPending}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful ({review.helpfulCount})
        </button>
      </CardContent>
    </Card>
  );
}
