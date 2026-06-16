'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookingAPI } from '../api/booking.api';

interface RecordPaymentVars {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

export function usePaymentRecording() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, ...data }: RecordPaymentVars) =>
      BookingAPI.recordPayment(bookingId, data),
    onSuccess: (_result, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'payments', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user'] });
      toast.success('Payment recorded');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to record payment');
    },
  });
}
