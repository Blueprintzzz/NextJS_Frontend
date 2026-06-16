'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookingAPI } from '../api/booking.api';
import type { CreatePassengerInput } from '../types/booking.types';

export function useAddPassenger(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePassengerInput) => BookingAPI.addPassenger(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', bookingId] });
      toast.success('Passenger added');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to add passenger');
    },
  });
}

export function useRemovePassenger(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (passengerId: string) => BookingAPI.removePassenger(bookingId, passengerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', bookingId] });
      toast.success('Passenger removed');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to remove passenger');
    },
  });
}
