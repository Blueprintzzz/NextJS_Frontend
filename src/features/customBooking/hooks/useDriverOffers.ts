'use client';

import { useState, useEffect, useCallback } from 'react';
import { CustomBookingAPI } from '../api/customBooking.api';
import type { DriverOffer } from '../types/customBooking.types';

export function useDriverOffers(customBookingId: string) {
  const [data, setData]       = useState<DriverOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await CustomBookingAPI.getOffers(customBookingId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  }, [customBookingId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
