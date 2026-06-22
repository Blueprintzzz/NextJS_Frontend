'use client';

import { UserReviewsPage } from '@/features/review';

export default function AccountReviewsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">My Reviews</h1>
      <UserReviewsPage />
    </div>
  );
}
