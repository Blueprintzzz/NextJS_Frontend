import { Car, Truck, Bus, Crown, Milestone } from 'lucide-react';
import type { Vehicle, VehicleType } from '../types/vehicle.types';

export function getVehicleTypeLabel(type: VehicleType): string {
  const labels: Record<VehicleType, string> = {
    CAR: 'Car',
    SUV: 'SUV',
    VAN: 'Van',
    MINIBUS: 'Minibus',
    LUXURY: 'Luxury',
  };
  return labels[type];
}

export function getVehicleTypeIcon(type: VehicleType) {
  const icons: Record<VehicleType, typeof Car> = {
    CAR: Car,
    SUV: Milestone,
    VAN: Truck,
    MINIBUS: Bus,
    LUXURY: Crown,
  };
  return icons[type] ?? Car;
}

export function formatPricePerDay(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export function calculateTotalVehicleCost(pricePerDay: number, numDays: number): number {
  return pricePerDay * numDays;
}

export function filterAvailableVehicles(
  vehicles: Vehicle[],
  startDate: string,
  endDate: string,
): Vehicle[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return vehicles.filter((v) => {
    if (!v.availability) return true;
    return v.availability
      .filter((a) => {
        const d = new Date(a.date).getTime();
        return d >= start && d <= end;
      })
      .every((a) => a.isAvailable);
  });
}

export function sortVehiclesByPrice(vehicles: Vehicle[], order: 'ASC' | 'DESC'): Vehicle[] {
  return [...vehicles].sort((a, b) =>
    order === 'ASC' ? a.pricePerDay - b.pricePerDay : b.pricePerDay - a.pricePerDay,
  );
}

export function matchVehicleCapacity(vehicle: Vehicle, numberOfTravelers: number): boolean {
  return vehicle.capacity >= numberOfTravelers;
}
