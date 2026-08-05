'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { VehicleAPI } from '../api/vehicle.api';
import type { VehicleFilters, CreateVehicleInput, VehicleType, VehicleEntity } from '../types/vehicle.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem('tfx_auth');
  if (!raw) return {};
  const { accessToken } = JSON.parse(raw) as { accessToken?: string };
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
}

function getDriverId(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('tfx_auth');
  if (!raw) return null;
  const { user } = JSON.parse(raw);
  return user?.id ?? null;
}

export function useDriverVehicles() {
  const [vehicles, setVehicles] = useState<VehicleEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const driverId = getDriverId();
    if (!driverId) { setIsLoading(false); setIsError(true); return; }
    setIsLoading(true);
    fetch(`${API_URL}/vehicles/driver/${driverId}`, { headers: getAuthHeaders() })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : data?.data ?? []);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return { data: vehicles, isLoading, isError };
}

export function useVehicles(filters?: VehicleFilters) {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['vehicles', 'list', filters],
    queryFn: async () => {
      const result = await VehicleAPI.getVehicles(filters);
      console.log('[useVehicles] raw API response:', result);
      return result;
    },
  });
  return { data: data ?? [], isLoading, isFetching, isError };
}

export function useVehicleById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles', 'detail', id],
    queryFn: () => VehicleAPI.getVehicleById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}

export function useCheckAvailability(
  startDate: string | null,
  endDate: string | null,
  vehicleType?: VehicleType,
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles', 'availability', startDate, endDate, vehicleType],
    queryFn: () => VehicleAPI.checkAvailability(startDate!, endDate!, vehicleType),
    enabled: !!startDate && !!endDate,
  });
  return { data: data ?? [], isLoading, isError };
}

export function useRecommendedVehicle(
  capacity: number | null,
  budget: number | null,
  days: number | null,
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles', 'recommendation', capacity, budget, days],
    queryFn: () => VehicleAPI.getRecommendedVehicle(capacity!, budget!, days!),
    enabled: !!capacity && !!budget && !!days,
  });
  return { data: data ?? null, isLoading, isError };
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleInput) => VehicleAPI.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'list'] });
      toast.success('Vehicle created successfully');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to create vehicle'),
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVehicleInput> }) =>
      VehicleAPI.updateVehicle(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'list'] });
      toast.success('Vehicle updated');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update vehicle'),
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => VehicleAPI.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'list'] });
      toast.success('Vehicle deleted');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to delete vehicle'),
  });
}
