'use client';

import { Star } from 'lucide-react';
import { RatingDistribution } from './RatingDistribution';
import type { ReviewStats as IStats } from '../types/review.types';

interface Props {
  stats: IStats;
}

export function ReviewStats({ stats }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
        <div className="flex justify-center gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`w-4 h-4 ${s <= Math.round(stats.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">{stats.totalReviews} reviews</p>
      </div>
      <div className="flex-1 w-full"><RatingDistribution stats={stats} /></div>
    </div>
  );
}
