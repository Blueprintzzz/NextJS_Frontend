'use client';

import { useQuery } from '@tanstack/react-query';
import { DestinationAPI } from '../api/destination.api';
import type { AttractionFilters, AttractionCategory } from '../types/destination.types';

export function useDistricts(search?: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['districts', 'list', search],
    queryFn: () => DestinationAPI.getDistricts(search),
  });
  return { data: data ?? [], isLoading, isError };
}

export function useDistrictById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['districts', 'detail', id],
    queryFn: () => DestinationAPI.getDistrictById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}

export function useFeaturedDistricts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['districts', 'featured'],
    queryFn: () => DestinationAPI.getFeaturedDistricts(),
    staleTime: 5 * 60 * 1000,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useAttractions(filters?: AttractionFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['attractions', 'list', filters],
    queryFn: () => DestinationAPI.getAttractions(filters),
  });
  return { data: data ?? [], isLoading, isError };
}

export function useAttractionsByCategory(category: AttractionCategory | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['attractions', 'category', category],
    queryFn: () => DestinationAPI.getAttractionsByCategory(category!),
    enabled: !!category,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useAttractionsByDistrict(districtId: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['attractions', 'district', districtId],
    queryFn: () => DestinationAPI.getAttractionsByDistrict(districtId!),
    enabled: !!districtId,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useMapData() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['map', 'data'],
    queryFn: () => DestinationAPI.getMapData(),
    staleTime: 10 * 60 * 1000,
  });
  return { data: data ?? { districts: [], attractions: [] }, isLoading, isError };
}

export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => DestinationAPI.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
  return { data: data ?? [], isLoading, isError };
}
