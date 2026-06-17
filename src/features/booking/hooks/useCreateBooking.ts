'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookingAPI } from '../api/booking.api';
import type { CreateBookingInput } from '../types/booking.types';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingInput) => BookingAPI.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'list'] });
      toast.success('Booking created successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create booking');
    },
  });
}
