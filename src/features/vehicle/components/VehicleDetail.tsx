'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleTypeIcon } from './VehicleTypeIcon';
import { VehicleFeatures } from './VehicleFeatures';
import { VehicleAvailability } from './VehicleAvailability';
import { formatPricePerDay } from '../utils/vehicle.utils';
import type { Vehicle } from '../types/vehicle.types';

interface Props {
  vehicle: Vehicle;
  onSelect?: () => void;
}

export function VehicleDetail({ vehicle, onSelect }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = vehicle.images.length ? vehicle.images : ['/placeholder.svg'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Carousel */}
      <div className="relative h-72 rounded-xl overflow-hidden bg-gray-100">
        <Image src={images[imgIdx]} alt={vehicle.name} fill className="object-cover" sizes="100vw" />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setImgIdx((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-gray-500">
              <VehicleTypeIcon type={vehicle.type} showLabel />
              <span className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" /> {vehicle.capacity} seats
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatPricePerDay(vehicle.pricePerDay)}</p>
            <p className="text-xs text-gray-400">per day</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{vehicle.description}</p>
      </div>

      <VehicleFeatures features={vehicle.features} />

      {vehicle.availability && <VehicleAvailability availability={vehicle.availability} />}

      {onSelect && (
        <Button className="w-full" onClick={onSelect}>
          Select This Vehicle
        </Button>
      )}
    </div>
  );
}
