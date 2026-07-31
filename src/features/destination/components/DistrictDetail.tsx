'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WeatherInfo } from './WeatherInfo';
import type { Destination } from '../types/destination.types';

interface Props { district: Destination; }

export function DistrictDetail({ district }: Props) {
  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100">
        {district.coverImage && (
          <Image src={district.coverImage} alt={district.name} fill className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-black/30 flex items-end p-6">
          <h1 className="text-3xl font-bold text-white">{district.name}</h1>
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed">{district.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Weather</h3>
          {district.weatherInfo && <WeatherInfo weather={district.weatherInfo} />}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-800">Best Time to Visit</h3>
          <p className="text-sm text-gray-600">{district.bestVisitingSeason}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href={`/packages?destination=${district.id}`}>
          <Button variant="outline">View Packages</Button>
        </Link>
      </div>
    </div>
  );
}
