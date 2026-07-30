'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DestinationAPI } from '../api/destination.api';
import type { DestinationFilters } from '../types/destination.types';

export function useDestinations(filters?: DestinationFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['destinations', 'list', filters],
    queryFn: () => DestinationAPI.getAll(filters),
  });
  return { data: data ?? [], isLoading, isError };
}

export function useDestinationById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['destinations', 'detail', id],
    queryFn: () => DestinationAPI.getById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}

export function useFeaturedDestinations() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['destinations', 'featured'],
    queryFn: () => DestinationAPI.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useCreateDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DestinationAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      toast.success('Destination created');
    },
  });
}

export function useUpdateDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof DestinationAPI.update>[1] }) =>
      DestinationAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      toast.success('Destination updated');
    },
  });
}

export function useDeleteDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DestinationAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      toast.success('Destination deleted');
    },
  });
}

export function useMapData() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['map', 'data'],
    queryFn: () => DestinationAPI.getMapData(),
    staleTime: 10 * 60 * 1000,
  });
  return { data: data ?? { destinations: [] }, isLoading, isError };
}

export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => DestinationAPI.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
  return { data: data ?? [], isLoading, isError };
}

// Legacy aliases
export const useDistricts = (search?: string) => useDestinations(search ? { search } : undefined);
export const useDistrictById = useDestinationById;
export const useFeaturedDistricts = useFeaturedDestinations;
export const useAttractions = (filters?: DestinationFilters) => useDestinations(filters);
export const useAttractionsByCategory = (category: string | null) =>
  useDestinations(category ? { category: category as Parameters<typeof useDestinations>[0] extends { category?: infer C } ? C : never } : undefined);
export const useAttractionsByDistrict = (_districtId: string | null) => ({ data: [], isLoading: false, isError: false });
