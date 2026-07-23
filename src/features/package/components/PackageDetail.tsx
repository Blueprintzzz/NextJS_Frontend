'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageCategoryBadge } from './PackageCategoryBadge';
import { PackageItinerary } from './PackageItinerary';
import { PackageInclusions } from './PackageInclusions';
import { usePackageById } from '../hooks/usePackages';
import { formatPrice } from '../utils/package.utils';

interface Props {
  packageId: string;
}

export function PackageDetail({ packageId }: Props) {
  const { data: pkg, isLoading, isError } = usePackageById(packageId);
  const [imgIdx, setImgIdx] = useState(0);

  if (isLoading) return (
    <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 rounded-lg bg-gray-100 animate-pulse" />)}</div>
  );
  if (isError || !pkg) return <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">Package not found.</p>;

  const images = pkg.images.length > 0 ? pkg.images : ['/placeholder.svg'];

  return (
    <div className="space-y-6">
      {/* Image carousel */}
      <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100">
        <Image src={images[imgIdx]} alt={pkg.name} fill className="object-cover" sizes="100vw" />
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setImgIdx((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => <span key={i} className={`w-2 h-2 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />)}
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PackageCategoryBadge category={pkg.category} />
            {pkg.rating != null && (
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{pkg.rating.toFixed(1)} ({pkg.reviewCount} reviews)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{pkg.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pkg.duration} days</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />Max {pkg.maxCapacity}</span>
            <span className="flex items-center gap-1"><Sun className="w-4 h-4" />{pkg.bestSeason}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{formatPrice(pkg.basePrice)}</p>
          <p className="text-xs text-gray-400 mt-1">per person</p>
          <Link href="/bookings/create">
            <Button className="mt-3" size="lg">Book Now</Button>
          </Link>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader><CardTitle className="text-base">About This Package</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">{pkg.description}</p>
          {pkg.highlights.length > 0 && (
            <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {pkg.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />{h}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Itinerary */}
      {pkg.itinerary.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Itinerary</CardTitle></CardHeader>
          <CardContent><PackageItinerary itinerary={pkg.itinerary} /></CardContent>
        </Card>
      )}

      {/* Inclusions */}
      {pkg.inclusions.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">What&apos;s Included</CardTitle></CardHeader>
          <CardContent><PackageInclusions inclusions={pkg.inclusions} /></CardContent>
        </Card>
      )}
    </div>
  );
}
