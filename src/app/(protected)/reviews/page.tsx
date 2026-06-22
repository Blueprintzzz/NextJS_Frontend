'use client';

import { ReviewList } from '@/features/review';

export default function ReviewsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">All Reviews</h1>
      <ReviewList />
    </div>
  );
}
