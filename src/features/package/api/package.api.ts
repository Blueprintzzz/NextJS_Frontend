import { apiRequest } from '@/lib/api';
import type {
  TourPackage,
  PackageFilters,
  PackagePaginationResponse,
  CreatePackageInput,
} from '../types/package.types';

const EMPTY_PAGE: PackagePaginationResponse = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const PackageAPI = {
  async getPackages(filters?: PackageFilters): Promise<PackagePaginationResponse> {
    try {
      const raw = await apiRequest(`/packages${buildQuery(filters as Record<string, unknown>)}`);
      return (raw as PackagePaginationResponse) ?? EMPTY_PAGE;
    } catch {
      return EMPTY_PAGE;
    }
  },

  async getFeaturedPackages(): Promise<TourPackage[]> {
    try {
      const raw = await apiRequest('/packages/featured');
      return Array.isArray(raw) ? (raw as TourPackage[]) : [];
    } catch {
      return [];
    }
  },

  async getPackageById(id: string): Promise<TourPackage | null> {
    try {
      return (await apiRequest(`/packages/${id}`)) as TourPackage;
    } catch {
      return null;
    }
  },

  async getPackagesByCategory(category: string): Promise<TourPackage[]> {
    try {
      const raw = await apiRequest(`/packages?category=${category}`);
      const page = raw as PackagePaginationResponse;
      return Array.isArray(page?.data) ? page.data : [];
    } catch {
      return [];
    }
  },

  async createPackage(data: CreatePackageInput): Promise<TourPackage> {
    return apiRequest('/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<TourPackage>;
  },

  async updatePackage(id: string, data: Partial<CreatePackageInput>): Promise<TourPackage> {
    return apiRequest(`/packages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<TourPackage>;
  },

  async deletePackage(id: string): Promise<void> {
    await apiRequest(`/packages/${id}`, { method: 'DELETE' });
  },

  async addItineraryDay(id: string, data: Record<string, unknown>): Promise<TourPackage> {
    return apiRequest(`/packages/${id}/itinerary`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<TourPackage>;
  },

  async updateItineraryDay(id: string, day: number, data: Record<string, unknown>): Promise<TourPackage> {
    return apiRequest(`/packages/${id}/itinerary/${day}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<TourPackage>;
  },

  async updateInclusions(id: string, data: Record<string, unknown>): Promise<TourPackage> {
    return apiRequest(`/packages/${id}/inclusions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<TourPackage>;
  },

  async featurePackage(id: string): Promise<TourPackage> {
    return apiRequest(`/packages/${id}/feature`, { method: 'POST' }) as Promise<TourPackage>;
  },

  async deactivatePackage(id: string): Promise<TourPackage> {
    return apiRequest(`/packages/${id}/deactivate`, { method: 'POST' }) as Promise<TourPackage>;
  },
};
