'use client';

import { getVehicleTypeIcon, getVehicleTypeLabel } from '../utils/vehicle.utils';
import type { VehicleType } from '../types/vehicle.types';

interface Props {
  type: VehicleType;
  showLabel?: boolean;
  className?: string;
}

export function VehicleTypeIcon({ type, showLabel = false, className }: Props) {
  const Icon = getVehicleTypeIcon(type);
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${className ?? ''}`}>
      <Icon className="w-4 h-4" />
      {showLabel && getVehicleTypeLabel(type)}
    </span>
  );
}
