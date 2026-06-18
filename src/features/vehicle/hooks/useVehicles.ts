'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { VehicleAPI } from '../api/vehicle.api';
import type { VehicleFilters, CreateVehicleInput, VehicleType } from '../types/vehicle.types';

export function useVehicles(filters?: VehicleFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles', 'list', filters],
    queryFn: () => VehicleAPI.getVehicles(filters),
  });
  return { data: data ?? [], isLoading, isError };
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
