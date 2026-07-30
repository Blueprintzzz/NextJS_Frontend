'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Destination } from '../types/destination.types';

interface Props { district: Destination; }

export function DistrictCard({ district }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-44 bg-gray-100">
        {district.coverImage ? (
          <Image src={district.coverImage} alt={district.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
        {district.featured && (
          <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>
        )}
      </div>
      <CardContent className="p-4 space-y-1">
        <h3 className="font-semibold text-gray-900">{district.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{district.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> {district.bestVisitingSeason ?? '—'}
          </span>
        </div>
        <Link href={`/destinations/${district.id}`} className="text-sm text-teal-600 hover:underline block pt-1">
          Explore →
        </Link>
      </CardContent>
    </Card>
  );
}
