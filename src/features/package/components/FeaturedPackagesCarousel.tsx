'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PackageCategoryBadge } from './PackageCategoryBadge';
import { useFeaturedPackages } from '../hooks/usePackages';
import { formatPrice } from '../utils/package.utils';

export function FeaturedPackagesCarousel() {
  const { data: packages, isLoading } = useFeaturedPackages();
  const [idx, setIdx] = useState(0);

  if (isLoading) return <div className="h-72 rounded-xl bg-gray-100 animate-pulse" />;
  if (!packages.length) return null;

  const visible = packages.slice(idx, idx + 3);
  const canPrev = idx > 0;
  const canNext = idx + 3 < packages.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Featured Packages</h2>
        <div className="flex gap-2">
          <button onClick={() => setIdx((i) => i - 1)} disabled={!canPrev} className="p-1.5 rounded-full border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setIdx((i) => i + 1)} disabled={!canNext} className="p-1.5 rounded-full border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((pkg) => (
          <Link key={pkg.id} href={`/packages/${pkg.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative h-44 bg-gray-100">
                {pkg.images[0] && <Image src={pkg.images[0]} alt={pkg.name} fill className="object-cover" sizes="33vw" />}
                <div className="absolute top-2 left-2"><PackageCategoryBadge category={pkg.category} /></div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-gray-900 line-clamp-1">{pkg.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{pkg.duration} days · {formatPrice(pkg.basePrice)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
