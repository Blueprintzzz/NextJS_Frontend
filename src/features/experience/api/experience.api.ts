import type { Experience, ExperienceFilters, PaginatedExperiences } from '../types/experience.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

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
