'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Star, MapPin } from 'lucide-react';
import type { TourPackage } from '@/features/package';
import { CATEGORY_LABELS, CATEGORY_COLORS, formatPrice } from '@/features/package';

interface TourCardProps {
  tour: TourPackage;
  href?: string;
}

export function TourCard({ tour, href }: TourCardProps) {
  const link = href ?? `/tours/${tour.id}`;

  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.images?.[0] || `https://picsum.photos/600/400?random=${tour.id}`}
          alt={tour.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-teal-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          {formatPrice(tour.basePrice)}
        </div>

        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[tour.category]}`}>
          {CATEGORY_LABELS[tour.category]}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{tour.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 flex-1">{tour.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            {tour.duration} Days
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-teal-500" />
            Max {tour.maxCapacity}
          </span>
          {tour.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {tour.rating.toFixed(1)}
              {tour.reviewCount && (
                <span className="text-gray-400">({tour.reviewCount})</span>
              )}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            {tour.bestSeason}
          </span>
        </div>

        <Link
          href={link}
          className="inline-block w-full text-center py-2.5 px-4 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
