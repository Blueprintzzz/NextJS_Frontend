'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useReviews } from '@/features/review';
import { ReviewCard, RatingDistribution } from '@/features/review';

const RATING_FILTERS = [
  { value: 0, label: 'All Ratings' },
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 2, label: '2 Stars' },
  { value: 1, label: '1 Star' },
];

export default function ReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState(0);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useReviews({
    status: 'APPROVED',
    ...(ratingFilter > 0 && { rating: ratingFilter }),
    page,
    limit: 12,
  });

  const reviews = data.data;
  const totalPages = data.pages;

  // Compute summary from current data as approximation
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Build distribution from current page data
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  reviews.forEach((r) => {
    const key = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[key]++;
  });

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 py-20 text-white text-center px-4">
        <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">
          Traveller Stories
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">What Our Guests Say</h1>
        <p className="text-teal-100 text-lg max-w-xl mx-auto">
          Real experiences from real travellers who explored Sri Lanka with GamanLk
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Rating Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
              <p className="text-5xl font-bold text-teal-600">{avgRating.toFixed(1)}</p>
              <div className="flex justify-center gap-0.5 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">{data.total} reviews</p>
            </div>

            {/* Rating Distribution */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Rating Breakdown</h3>
                <RatingDistribution
                  stats={{ avgRating, totalReviews: data.total, ratingDistribution: distribution }}
                />
              </div>
            )}

            {/* Filter by Rating */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Filter by Rating</h3>
              <div className="space-y-1">
                {RATING_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setRatingFilter(f.value); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      ratingFilter === f.value
                        ? 'bg-teal-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {f.value > 0 && (
                      <span className="inline-flex items-center gap-1 mr-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      </span>
                    )}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Reviews Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {ratingFilter > 0 ? `${ratingFilter}-Star Reviews` : 'All Reviews'}
              </h2>
              {!isLoading && (
                <p className="text-sm text-gray-500">{data.total} review{data.total !== 1 ? 's' : ''}</p>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-40 rounded-2xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No reviews yet</h3>
                <p className="text-gray-500 mt-2">Be the first to share your experience!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
