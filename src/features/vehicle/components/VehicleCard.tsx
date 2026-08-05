'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VehicleTypeIcon } from './VehicleTypeIcon';
import { formatPricePerDay } from '../utils/vehicle.utils';
import type { Vehicle } from '../types/vehicle.types';

interface Props {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
  totalDays?: number;
}

export function VehicleCard({ vehicle, onSelect, totalDays }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-44 bg-gray-100">
        {vehicle.images[0] ? (
          <Image
            src={vehicle.images[0]}
            alt={vehicle.name ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{vehicle.name}</h3>
          <VehicleTypeIcon type={vehicle.type} showLabel />
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {vehicle.capacity} seats
          </span>
          <span>{formatPricePerDay(vehicle.pricePerDay)} / day</span>
        </div>
        {vehicle.features.length > 0 && (
          <p className="text-xs text-gray-400 line-clamp-1">{vehicle.features.join(' · ')}</p>
        )}
        {totalDays != null && (
          <p className="text-sm font-medium text-gray-700">
            Total: {formatPricePerDay(vehicle.pricePerDay * totalDays)} ({totalDays} days)
          </p>
        )}
        <div className="flex gap-2 pt-1">
          <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">Details</Button>
          </Link>
          {onSelect && (
            <Button size="sm" className="flex-1" onClick={() => onSelect(vehicle)}>
              Select
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
