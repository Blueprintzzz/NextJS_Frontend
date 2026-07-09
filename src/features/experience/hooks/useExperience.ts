'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getExperiences,
  getExperiencesPaginated,
  getExperienceById,
  getFeaturedExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  toggleFeatureExperience,
} from '../api/experience.api';
import type { CreateExperienceInput } from '../api/experience.api';
import type { ExperienceFilters, ExperienceCategory, PaginatedExperiences } from '../types/experience.types';

const EMPTY: PaginatedExperiences = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

export function useExperiences(filters?: ExperienceFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'list', filters],
    queryFn: () => getExperiences(filters),
  });
  return { data: data ?? [], isLoading, isError };
}

export function useExperiencesPaginated(filters?: ExperienceFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'paginated', filters],
    queryFn: () => getExperiencesPaginated(filters),
  });
  return { data: data ?? EMPTY, isLoading, isError };
}

export function useExperienceById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'detail', id],
    queryFn: () => getExperienceById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}

export function useFeaturedExperiences() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'featured'],
    queryFn: () => getFeaturedExperiences(),
    staleTime: 5 * 60 * 1000,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useExperiencesByCategory(category: ExperienceCategory | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'list', { category }],
    queryFn: () => getExperiences({ category: category! }),
    enabled: !!category,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExperienceInput) => createExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience created successfully');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to create experience'),
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExperienceInput> }) =>
      updateExperience(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['experiences', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['experiences', 'paginated'] });
      toast.success('Experience updated');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update experience'),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to delete experience'),
  });
}

export function useToggleFeatureExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleFeatureExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Featured status updated');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update featured status'),
  });
}
