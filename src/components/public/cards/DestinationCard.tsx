'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CalendarDays, Sun } from 'lucide-react';
import type { Destination } from '@/features/destination';

interface DestinationCardProps {
  district: Destination;
}

export function DestinationCard({ district }: DestinationCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={district.coverImage || `https://picsum.photos/600/400?random=${district.id}`}
          alt={district.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {district.featured && (
          <span className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{district.name}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">{district.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          {district.images?.length > 0 && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              {district.category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5 text-teal-500" />
            {district.bestVisitingSeason ?? '—'}
          </span>
        </div>

        {district.weatherInfo?.temperature && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>{district.weatherInfo.temperature}</span>
            {district.weatherInfo.condition && (
              <span className="ml-1 text-gray-400">· {district.weatherInfo.condition}</span>
            )}
          </div>
        )}

        <Link
          href={`/destinations/${district.id}`}
          className="inline-block w-full text-center py-2 px-4 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
