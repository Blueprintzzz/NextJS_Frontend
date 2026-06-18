import { apiRequest } from '@/lib/api';
import type {
  Vehicle,
  VehicleFilters,
  AvailabilityResult,
  CreateVehicleInput,
} from '../types/vehicle.types';

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const VehicleAPI = {
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    try {
      const raw = await apiRequest(`/vehicles${buildQuery(filters as Record<string, unknown>)}`);
      // Unwrap { success, data } envelope if present, else treat as plain array
      if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data)) {
        return (raw as { data: Vehicle[] }).data;
      }
      return Array.isArray(raw) ? (raw as Vehicle[]) : [];
    } catch {
      return [];
    }
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const raw = await apiRequest(`/vehicles/${id}`);
      if (raw && typeof raw === 'object' && 'data' in raw) {
        return (raw as { data: Vehicle }).data;
      }
      return raw as Vehicle;
    } catch {
      return null;
    }
  },

  async checkAvailability(
    startDate: string,
    endDate: string,
    vehicleType?: string,
  ): Promise<AvailabilityResult[]> {
    try {
      const raw = await apiRequest('/vehicles/check-availability', {
        method: 'POST',
        body: JSON.stringify({ startDate, endDate, vehicleType }),
      });
      if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data)) {
        return (raw as { data: AvailabilityResult[] }).data;
      }
      return Array.isArray(raw) ? (raw as AvailabilityResult[]) : [];
    } catch {
      return [];
    }
  },

  async getRecommendedVehicle(
    numberOfTravelers: number,
    budget: number,
    tripDays: number,
  ): Promise<Vehicle | null> {
    try {
      const raw = await apiRequest(
        `/vehicles/recommendations?numberOfTravelers=${numberOfTravelers}&budget=${budget}&tripDays=${tripDays}`,
      );
      if (raw && typeof raw === 'object' && 'data' in raw) {
        return (raw as { data: Vehicle }).data;
      }
      return raw as Vehicle;
    } catch {
      return null;
    }
  },

  async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
    return apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<Vehicle>;
  },

  async updateVehicle(id: string, data: Partial<CreateVehicleInput>): Promise<Vehicle> {
    return apiRequest(`/vehicles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<Vehicle>;
  },

  async deleteVehicle(id: string): Promise<void> {
    await apiRequest(`/vehicles/${id}`, { method: 'DELETE' });
  },
};
