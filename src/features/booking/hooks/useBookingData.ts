'use client';

import { useQuery } from '@tanstack/react-query';
import { BookingAPI } from '../api/booking.api';
import type { BookingQueryParams, BookingPaginationResponse } from '../types/booking.types';

const EMPTY: BookingPaginationResponse = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

export function useBookingData(query?: BookingQueryParams) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', 'list', query],
    queryFn: () => BookingAPI.getUserBookings(query),
  });
  return { data: data ?? EMPTY, isLoading, isError, refetch };
}

// Alias — both hit GET /bookings
export const useAllBookings = useBookingData;

export function useBookingById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookings', 'detail', id],
    queryFn: () => BookingAPI.getBookingById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}
