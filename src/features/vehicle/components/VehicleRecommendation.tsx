'use client';

import { useRecommendedVehicle } from '../hooks/useVehicles';
import { VehicleCard } from './VehicleCard';
import type { Vehicle } from '../types/vehicle.types';

interface Props {
  capacity: number;
  budget: number;
  days: number;
  onSelect?: (vehicle: Vehicle) => void;
}

export function VehicleRecommendation({ capacity, budget, days, onSelect }: Props) {
  const { data, isLoading } = useRecommendedVehicle(capacity, budget, days);

  if (isLoading) return <div className="h-40 rounded-lg bg-gray-100 animate-pulse" />;
  if (!data) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">Recommended Vehicle</p>
      <VehicleCard vehicle={data} onSelect={onSelect} totalDays={days} />
    </div>
  );
}
