'use client';

import type { ReviewStats } from '../types/review.types';

interface Props {
  stats: ReviewStats;
}

export function RatingDistribution({ stats }: Props) {
  const max = Math.max(...Object.values(stats.ratingDistribution), 1);

  return (
    <div className="space-y-1.5">
      {([5, 4, 3, 2, 1] as const).map((star) => {
        const count = stats.ratingDistribution[star] ?? 0;
        const pct = Math.round((count / max) * 100);
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-4 text-right text-gray-600">{star}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-6 text-right text-gray-500 text-xs">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
