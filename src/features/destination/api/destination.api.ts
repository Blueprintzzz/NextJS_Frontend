import { apiRequest } from '@/lib/api';
import type {
  District,
  Attraction,
  TourCategory,
  AttractionFilters,
} from '../types/destination.types';

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
  // Districts
  async getDistricts(search?: string): Promise<District[]> {
    try {
      const raw = await apiRequest(`/districts${buildQuery({ ...(search ? { search } : {}), limit: 100 })}`);
      return extractList<District>(raw);
    } catch { return []; }
  },

  async getDistrictById(id: string): Promise<District | null> {
    try { return (await apiRequest(`/districts/${id}`)) as District; }
    catch { return null; }
  },

  async getFeaturedDistricts(): Promise<District[]> {
    try {
      const raw = await apiRequest('/districts/featured');
      return extractList<District>(raw);
    } catch { return []; }
  },

  async createDistrict(data: Partial<District>): Promise<District> {
    return apiRequest('/districts', { method: 'POST', body: JSON.stringify(data) }) as Promise<District>;
  },

  async updateDistrict(id: string, data: Partial<District>): Promise<District> {
    return apiRequest(`/districts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }) as Promise<District>;
  },

  async deleteDistrict(id: string): Promise<void> {
    await apiRequest(`/districts/${id}`, { method: 'DELETE' });
  },

  async setDistrictFeatured(id: string): Promise<District> {
    return apiRequest(`/districts/${id}/featured`, { method: 'POST' }) as Promise<District>;
  },

  // Attractions
  async getAttractions(filters?: AttractionFilters): Promise<Attraction[]> {
    try {
      const raw = await apiRequest(`/attractions${buildQuery(filters as Record<string, unknown>)}`);
      return extractList<Attraction>(raw);
    } catch { return []; }
  },

  async getAttractionById(id: string): Promise<Attraction | null> {
    try { return (await apiRequest(`/attractions/${id}`)) as Attraction; }
    catch { return null; }
  },

  async getAttractionsByCategory(category: string): Promise<Attraction[]> {
    try {
      const raw = await apiRequest(`/attractions/category/${category}`);
      return extractList<Attraction>(raw);
    } catch { return []; }
  },

  async getAttractionsByDistrict(districtId: string): Promise<Attraction[]> {
    try {
      const raw = await apiRequest(`/attractions/district/${districtId}`);
      return extractList<Attraction>(raw);
    } catch { return []; }
  },

  async createAttraction(data: Partial<Attraction>): Promise<Attraction> {
    return apiRequest('/attractions', { method: 'POST', body: JSON.stringify(data) }) as Promise<Attraction>;
  },

  async updateAttraction(id: string, data: Partial<Attraction>): Promise<Attraction> {
    return apiRequest(`/attractions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }) as Promise<Attraction>;
  },

  async deleteAttraction(id: string): Promise<void> {
    await apiRequest(`/attractions/${id}`, { method: 'DELETE' });
  },

  // Map & Categories
  async getMapData(): Promise<{ districts: District[]; attractions: Attraction[] }> {
    try {
      return (await apiRequest('/map/data')) as { districts: District[]; attractions: Attraction[] };
    } catch { return { districts: [], attractions: [] }; }
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
};
