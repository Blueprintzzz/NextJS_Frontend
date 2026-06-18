'use client';

import { useState } from 'react';
import { useAttractionsByDistrict, useAttractionsByCategory, useAttractions } from '../hooks/useDestination';
import { AttractionCard } from './AttractionCard';
import type { AttractionCategory } from '../types/destination.types';

const PAGE_SIZE = 12;

interface Props {
  districtId?: string;
  category?: AttractionCategory;
  limit?: number;
  paginated?: boolean;
}

export function AttractionList({ districtId, category, limit, paginated }: Props) {
  const [page, setPage] = useState(1);

  const byDistrict = useAttractionsByDistrict(districtId ?? null);
  const byCategory = useAttractionsByCategory(category ?? null);
  const all = useAttractions();

  const { data, isLoading } = districtId ? byDistrict : category ? byCategory : all;

  const pageSize = paginated ? PAGE_SIZE : (limit ?? data.length);
  const sliced = data.slice(0, paginated ? page * pageSize : pageSize);
  const hasMore = paginated && sliced.length < data.length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: limit ?? 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No attractions found.</p>;
  }

  return (
    <div className="space-y-4">
      {paginated && (
        <p className="text-sm text-gray-500">{data.length} attractions</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliced.map((a) => <AttractionCard key={a.id} attraction={a} />)}
      </div>
      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="w-full py-2 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}
