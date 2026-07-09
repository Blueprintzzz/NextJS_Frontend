'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageCard } from './PackageCard';
import { PackageFilters } from './PackageFilters';
import { usePackages } from '../hooks/usePackages';
import type { PackageCategory } from '../types/package.types';

const DEFAULT_FILTERS: {
  search: string;
  category?: PackageCategory;
  minPrice: string;
  maxPrice: string;
  minDuration: string;
  maxDuration: string;
} = {
  search: '',
  category: undefined,
  minPrice: '',
  maxPrice: '',
  minDuration: '',
  maxDuration: '',
};

export function PackageList() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = usePackages({
    search: filters.search || undefined,
    category: filters.category,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    minDuration: filters.minDuration ? Number(filters.minDuration) : undefined,
    maxDuration: filters.maxDuration ? Number(filters.maxDuration) : undefined,
    page,
    limit: 12,
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-56 flex-shrink-0">
        <PackageFilters value={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
      </aside>

      <div className="flex-1 space-y-4">
        {isError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">Failed to load packages.</p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{data.total} packages found</p>
              <Link href="/packages/featured">
                <Button variant="outline" size="sm">View Featured</Button>
              </Link>
            </div>
            {data.data.length === 0 ? (
              <p className="text-center text-gray-400 py-16">No packages match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
              </div>
            )}
            {data.pages > 1 && (
              <div className="flex items-center justify-between text-sm pt-2">
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
    </div>
  );
}
