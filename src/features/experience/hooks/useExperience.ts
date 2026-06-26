'use client';

import { useQuery } from '@tanstack/react-query';
import { ExperienceAPI } from '../api/experience.api';
import type { ExperienceFilters, ExperienceCategory } from '../types/experience.types';

export function useExperiences(filters?: ExperienceFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'list', filters],
    queryFn: () => ExperienceAPI.getExperiences(filters),
  });
  return { data: data ?? [], isLoading, isError };
}

export function useExperienceById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'detail', id],
    queryFn: () => ExperienceAPI.getExperienceById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}

export function useFeaturedExperiences() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'featured'],
    queryFn: () => ExperienceAPI.getFeaturedExperiences(),
    staleTime: 5 * 60 * 1000,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useExperiencesByCategory(category: ExperienceCategory | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'category', category],
    queryFn: () => ExperienceAPI.getExperiencesByCategory(category!),
    enabled: !!category,
  });
  return { data: data ?? [], isLoading, isError };
}