export type VehicleType = 'CAR' | 'SUV' | 'VAN' | 'MINIBUS' | 'LUXURY';
export type VehicleStatus = 'ACTIVE' | 'INACTIVE';

export interface VehicleAvailability {
  date: string;
  isAvailable: boolean;
}

export interface Vehicle {
  id: string;
  name?: string;
  type: VehicleType;
  capacity: number;
  pricePerDay: number;
  images: string[];
  features: string[];
  description: string;
  status: VehicleStatus;
  availability?: VehicleAvailability[];
}

export interface VehicleEntity {
  id: string;
  driverId: string;
  vehicleModelId: string;
  vehicleModelName?: string;
  type: VehicleType;
  capacity: number;
  pricePerDay: number;
  images: string[];
  features: string[];
  status: VehicleStatus;
  description?: string;
  registrationNumber: string;
  createdAt: string;
  updatedAt: string;
  availability?: any[];
}

export interface VehicleFilters {
  type?: VehicleType;
  minCapacity?: number;
  maxPrice?: number;
}

export interface CheckAvailabilityInput {
  startDate: string;
  endDate: string;
  vehicleType?: VehicleType;
}

export interface AvailabilityResult {
  vehicleId: string;
  available: boolean;
  dates: VehicleAvailability[];
}

export interface CreateVehicleInput {
  name?: string;
  vehicleModelId: string;
  registrationNumber: string;
  type: VehicleType;
  capacity: number;
  pricePerDay: number;
  images: string[];
  features: string[];
  description: string;
  status: VehicleStatus;
}
