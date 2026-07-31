'use client';

import { useState, useEffect, useCallback } from 'react';
import { CustomBookingAPI } from '../api/customBooking.api';
import type { CustomBooking, CustomBookingQueryParams } from '../types/customBooking.types';

export function useMyCustomBookings(query?: CustomBookingQueryParams) {
  const [data, setData]       = useState<CustomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await CustomBookingAPI.getMy(query));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  // JSON.stringify for stable dep comparison
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useCustomBookingById(id: string) {
  const [data, setData]       = useState<CustomBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await CustomBookingAPI.getById(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
