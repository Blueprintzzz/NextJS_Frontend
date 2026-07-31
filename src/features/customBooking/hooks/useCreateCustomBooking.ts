'use client';

import { useState } from 'react';
import { CustomBookingAPI } from '../api/customBooking.api';
import type { CreateCustomBookingInput, CustomBooking } from '../types/customBooking.types';

export function useCreateCustomBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function submit(data: CreateCustomBookingInput): Promise<CustomBooking> {
    setLoading(true);
    setError(null);
    try {
      return await CustomBookingAPI.create(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to submit';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
