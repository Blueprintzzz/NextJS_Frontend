'use client';

import { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleCard } from './VehicleCard';
import { VehicleTypeIcon } from './VehicleTypeIcon';
import type { Vehicle, VehicleType } from '../types/vehicle.types';

const TYPES: VehicleType[] = ['CAR', 'SUV', 'VAN', 'MINIBUS', 'LUXURY'];

interface Props {
  onSelect?: (vehicle: Vehicle) => void;
  totalDays?: number;
}

export function VehicleList({ onSelect, totalDays }: Props) {
  const [type, setType] = useState<VehicleType | undefined>();
  const { data, isLoading, isFetching, isError } = useVehicles(type ? { type } : undefined);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setType(undefined)}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${!type ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600 hover:border-gray-600'}`}
        >
          All
        </button>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t === type ? undefined : t)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${type === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600 hover:border-gray-600'}`}
          >
            <VehicleTypeIcon type={t} showLabel />
          </button>
        ))}
      </div>
      {isError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          Failed to load vehicles. Please try again.
        </p>
      )}
      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-sm">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((v) => (
            <VehicleCard key={v.id} vehicle={v} onSelect={onSelect} totalDays={totalDays} />
          ))}
        </div>
      )}
    </div>
  );
}
