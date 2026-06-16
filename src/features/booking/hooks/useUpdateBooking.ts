'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookingAPI } from '../api/booking.api';
import type { CreateBookingInput } from '../types/booking.types';

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBookingInput> }) =>
      BookingAPI.updateBooking(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user'] });
      toast.success('Booking updated');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update booking');
    },
  });
}
