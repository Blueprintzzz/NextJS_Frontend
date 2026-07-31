'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Pencil, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PackageFilters, PackageCategoryBadge } from '@/features/package';
import { usePackages } from '@/features/package';
import { formatPrice } from '@/features/package';
import type { PackageCategory, TourPackage } from '@/features/package';

const DEFAULT_FILTERS = {
  search: '',
  category: undefined as PackageCategory | undefined,
  minPrice: '',
  maxPrice: '',
  minDuration: '',
  maxDuration: '',
};

type Filters = typeof DEFAULT_FILTERS;

// ─── Admin package card with Edit button ─────────────────────────────────────
function AdminPackageCard({ pkg }: { pkg: TourPackage }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 flex-shrink-0">
        {pkg.images[0] ? (
          <Image
            src={pkg.images[0]}
            alt={pkg.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        <div className="absolute top-2 left-2">
          <PackageCategoryBadge category={pkg.category} />
        </div>
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              pkg.status === 'ACTIVE'
                ? 'bg-green-100 text-green-700'
                : pkg.status === 'DRAFT'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {pkg.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <CardContent className="p-4 space-y-2 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{pkg.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{pkg.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pkg.duration} days
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Max {pkg.maxCapacity}
          </span>
          {pkg.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {pkg.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(pkg.basePrice)}
          </span>
        </div>

        {/* Edit button */}
        <Link href={`/admin/packages/${pkg.id}/edit`} className="block pt-1">
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PackagesPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Package Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage, edit, and control package visibility.</p>
        </div>
        <Link href="/admin/packages/create">
          <Button>+ New Package</Button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <PackageFilters
            value={filters}
            onChange={(f) => { setFilters({ ...DEFAULT_FILTERS, ...f }); setPage(1); }}
          />
        </aside>

        {/* Grid */}
        <div className="flex-1 space-y-4">
          {isError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
              Failed to load packages.
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">{data.total} packages found</p>

              {data.data.length === 0 ? (
                <p className="text-center text-gray-400 py-16">No packages match your filters.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.data.map((pkg) => (
                    <AdminPackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              )}

              {data.pages > 1 && (
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-gray-500">
                    Page {data.page} of {data.pages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
