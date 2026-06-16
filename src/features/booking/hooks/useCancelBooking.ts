'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookingAPI } from '../api/booking.api';

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingAPI.cancelBooking(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user'] });
      toast.success('Booking cancelled');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to cancel booking');
    },
  });
}
