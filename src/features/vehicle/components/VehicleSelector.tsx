'use client';

import { useMemo } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { useCheckAvailability } from '../hooks/useVehicles';
import { VehicleCard } from './VehicleCard';
import { filterAvailableVehicles, matchVehicleCapacity } from '../utils/vehicle.utils';
import type { Vehicle } from '../types/vehicle.types';

interface Props {
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  onSelect: (vehicle: Vehicle) => void;
}

export function VehicleSelector({ startDate, endDate, numberOfTravelers, onSelect }: Props) {
  const { data: all } = useVehicles();
  const { data: availability } = useCheckAvailability(startDate, endDate);

  const availableIds = useMemo(
    () => new Set(availability.filter((a) => a.available).map((a) => a.vehicleId)),
    [availability],
  );

  const vehicles = useMemo(() => {
    let list = all.filter((v) => matchVehicleCapacity(v, numberOfTravelers));
    if (availability.length) list = list.filter((v) => availableIds.has(v.id));
    else list = filterAvailableVehicles(list, startDate, endDate);
    return list;
  }, [all, availability, availableIds, numberOfTravelers, startDate, endDate]);

  const days = useMemo(() => {
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(1, Math.ceil(diff / 86400000));
  }, [startDate, endDate]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available for {days} day{days !== 1 ? 's' : ''} · {numberOfTravelers} traveler{numberOfTravelers !== 1 ? 's' : ''}
      </p>
      {vehicles.length === 0 ? (
        <p className="text-gray-500 text-sm">No vehicles match your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} onSelect={onSelect} totalDays={days} />
          ))}
        </div>
      )}
    </div>
  );
}
