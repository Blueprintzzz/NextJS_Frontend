'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PackageCategoryBadge } from './PackageCategoryBadge';
import { formatPrice } from '../utils/package.utils';
import type { TourPackage } from '../types/package.types';

interface Props {
  pkg: TourPackage;
}

export function PackageCard({ pkg }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {pkg.images[0] ? (
          <Image src={pkg.images[0]} alt={pkg.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
        <div className="absolute top-2 left-2">
          <PackageCategoryBadge category={pkg.category} />
        </div>
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{pkg.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{pkg.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.duration} days</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {pkg.maxCapacity}</span>
          {pkg.rating != null && (
            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{pkg.rating.toFixed(1)}</span>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-gray-900">{formatPrice(pkg.basePrice)}</span>
          <Link
            href={`/packages/${pkg.id}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
