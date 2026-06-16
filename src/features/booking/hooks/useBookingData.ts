'use client';

import { useQuery } from '@tanstack/react-query';
import { BookingAPI } from '../api/booking.api';
import type { BookingQueryParams } from '../types/booking.types';

export function useBookingData(query?: BookingQueryParams) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', 'user', query],
    queryFn: () => BookingAPI.getUserBookings(query),
  });
  return { data: data ?? { data: [], total: 0, page: 1, limit: 10, pages: 0 }, isLoading, isError, refetch };
}

export function useAllBookings(query?: BookingQueryParams) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', 'all', query],
    queryFn: () => BookingAPI.getAllBookings(query),
  });
  return { data: data ?? { data: [], total: 0, page: 1, limit: 10, pages: 0 }, isLoading, isError, refetch };
}

export function useBookingById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookings', 'detail', id],
    queryFn: () => BookingAPI.getBookingById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}
