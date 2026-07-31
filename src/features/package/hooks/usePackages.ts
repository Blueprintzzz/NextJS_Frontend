'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PackageAPI } from '../api/package.api';
import type {
  PackageFilters,
  PackagePaginationResponse,
  CreatePackageInput,
  PackageCategory,
} from '../types/package.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const EMPTY: PackagePaginationResponse = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

export function useMyPackages(query?: PackageFilters) {
  const [result, setResult] = useState<PackagePaginationResponse>({
    data: [], total: 0, page: 1, limit: 20, pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('tfx_auth');
    if (!raw) return;
    const { accessToken } = JSON.parse(raw);
    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    fetch(`${API_URL}/packages/my?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => setResult(data))
      .finally(() => setIsLoading(false));
  }, []);

  return { data: result, isLoading };
}

export function usePackages(filters?: PackageFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['packages', 'list', filters],
    queryFn: () => PackageAPI.getAll(filters),
  });
  return { data: data ?? EMPTY, isLoading, isError };
}

export function useFeaturedPackages() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['packages', 'featured'],
    queryFn: () => PackageAPI.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
  return { data: data ?? [], isLoading, isError };
}

export function usePackageById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['packages', 'detail', id],
    queryFn: () => PackageAPI.getById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}

export function usePackagesByCategory(
  category: PackageCategory | null,
  page = 1,
  limit = 10,
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['packages', 'category', category, page, limit],
    queryFn: () => PackageAPI.getByCategory(category!, page, limit),
    enabled: !!category,
  });
  return { data: data ?? EMPTY, isLoading, isError };
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePackageInput) => PackageAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages', 'list'] });
      toast.success('Package created successfully');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to create package'),
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePackageInput> }) =>
      PackageAPI.update(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['packages', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['packages', 'list'] });
      toast.success('Package updated successfully');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update package'),
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PackageAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages', 'list'] });
      toast.success('Package deleted');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to delete package'),
  });
}
