import { API_URL } from '@/lib/api/config';
import { buildJsonHeaders } from '@/lib/api/headers';
import type { Experience, ExperienceFilters, PaginatedExperiences } from '../types/experience.types';

export async function getExperiences(filters?: ExperienceFilters): Promise<Experience[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'ALL') params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const qs = params.toString();
    const res = await fetch(`${API_URL}/experiences${qs ? `?${qs}` : ''}`);
    if (!res.ok) return [];
    const json: PaginatedExperiences = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getExperiencesPaginated(filters?: ExperienceFilters): Promise<PaginatedExperiences> {
  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'ALL') params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const qs = params.toString();
    const res = await fetch(`${API_URL}/experiences${qs ? `?${qs}` : ''}`);
    if (!res.ok) return { data: [], total: 0, page: 1, limit: 10, pages: 0 };
    return res.json() as Promise<PaginatedExperiences>;
  } catch {
    return { data: [], total: 0, page: 1, limit: 10, pages: 0 };
  }
}

export async function getFeaturedExperiences(): Promise<Experience[]> {
  try {
    const res = await fetch(`${API_URL}/experiences/featured`);
    if (!res.ok) return [];
    const json: Experience[] = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function getExperienceById(id: string): Promise<Experience> {
  const res = await fetch(`${API_URL}/experiences/${id}`);
  if (!res.ok) throw new Error('Experience not found');
  return res.json() as Promise<Experience>;
}

export async function createExperience(data: CreateExperienceInput): Promise<Experience> {
  const res = await fetch(`${API_URL}/experiences`, {
    method: 'POST',
    headers: buildJsonHeaders('/experiences'),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Failed to create experience');
  }
  return res.json() as Promise<Experience>;
}

export async function updateExperience(id: string, data: Partial<CreateExperienceInput>): Promise<Experience> {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: 'PATCH',
    headers: buildJsonHeaders(`/experiences/${id}`),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Failed to update experience');
  }
  return res.json() as Promise<Experience>;
}

export async function deleteExperience(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: 'DELETE',
    headers: buildJsonHeaders(`/experiences/${id}`),
  });
  if (!res.ok) throw new Error('Failed to delete experience');
}

export async function toggleFeatureExperience(id: string): Promise<Experience> {
  const res = await fetch(`${API_URL}/experiences/${id}/feature`, {
    method: 'POST',
    headers: buildJsonHeaders(`/experiences/${id}/feature`),
  });
  if (!res.ok) throw new Error('Failed to toggle feature');
  return res.json() as Promise<Experience>;
}

export interface CreateExperienceInput {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  image?: string;
  images?: string[];
  location?: string;
  destinationId?: string;
  featured?: boolean;
  status?: string;
  capacity?: number;
  availability?: string;
}
