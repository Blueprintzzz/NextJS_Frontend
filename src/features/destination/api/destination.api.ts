import { apiRequest } from '@/lib/api';
import type { Destination, DestinationFilters, TourCategory } from '../types/destination.types';

interface Paginated<T> { data: T[]; total: number; page: number; limit: number; pages: number; }
function extractList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object' && Array.isArray((raw as Paginated<T>).data)) return (raw as Paginated<T>).data;
  return [];
}

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const DestinationAPI = {
  async getAll(filters?: DestinationFilters): Promise<Destination[]> {
    try {
      const raw = await apiRequest(`/destinations${buildQuery({ ...(filters as Record<string, unknown>), limit: filters?.limit ?? 100 })}`);
      return extractList<Destination>(raw);
    } catch { return []; }
  },

  async getById(id: string): Promise<Destination | null> {
    try { return (await apiRequest(`/destinations/${id}`)) as Destination; }
    catch { return null; }
  },

  async getFeatured(): Promise<Destination[]> {
    try {
      const raw = await apiRequest('/destinations/featured');
      return extractList<Destination>(raw);
    } catch { return []; }
  },

  async create(data: Partial<Destination>): Promise<Destination> {
    return apiRequest('/destinations', { method: 'POST', body: JSON.stringify(data) }) as Promise<Destination>;
  },

  async update(id: string, data: Partial<Destination>): Promise<Destination> {
    return apiRequest(`/destinations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }) as Promise<Destination>;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/destinations/${id}`, { method: 'DELETE' });
  },

  async setFeatured(id: string): Promise<Destination> {
    return apiRequest(`/destinations/${id}/featured`, { method: 'POST' }) as Promise<Destination>;
  },

  async getMapData(): Promise<{ destinations: Destination[] }> {
    try {
      return (await apiRequest('/map/data')) as { destinations: Destination[] };
    } catch { return { destinations: [] }; }
  },

  async getCategories(): Promise<TourCategory[]> {
    try {
      const raw = await apiRequest('/categories');
      return extractList<TourCategory>(raw);
    } catch { return []; }
  },

  async getCategoryBySlug(category: string): Promise<TourCategory | null> {
    try { return (await apiRequest(`/categories/${category}`)) as TourCategory; } catch { return null; }
  },

  async createCategory(data: Partial<TourCategory>): Promise<TourCategory> {
    return apiRequest('/categories', { method: 'POST', body: JSON.stringify(data) }) as Promise<TourCategory>;
  },

  // Legacy aliases
  getDistricts: (search?: string) => DestinationAPI.getAll(search ? { search } : undefined),
  getDistrictById: (id: string) => DestinationAPI.getById(id),
  getFeaturedDistricts: () => DestinationAPI.getFeatured(),
  createDistrict: (data: Partial<Destination>) => DestinationAPI.create(data),
  updateDistrict: (id: string, data: Partial<Destination>) => DestinationAPI.update(id, data),
  deleteDistrict: (id: string) => DestinationAPI.delete(id),
  setDistrictFeatured: (id: string) => DestinationAPI.setFeatured(id),
  getAttractions: (filters?: DestinationFilters) => DestinationAPI.getAll(filters),
  getAttractionById: (id: string) => DestinationAPI.getById(id),
  getAttractionsByCategory: (category: string) => DestinationAPI.getAll({ category: category as Destination['category'] }),
  getAttractionsByDistrict: (_districtId: string) => Promise.resolve([] as Destination[]),
  createAttraction: (data: Partial<Destination>) => DestinationAPI.create(data),
  updateAttraction: (id: string, data: Partial<Destination>) => DestinationAPI.update(id, data),
  deleteAttraction: (id: string) => DestinationAPI.delete(id),
};
