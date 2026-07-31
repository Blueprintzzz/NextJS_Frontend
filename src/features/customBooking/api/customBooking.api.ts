import type {
  CustomBooking,
  CustomBookingPaginationResponse,
  CustomBookingQueryParams,
  CreateCustomBookingInput,
  DriverOffer,
} from '../types/customBooking.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const EMPTY_PAGE: CustomBookingPaginationResponse = {
  data: [], total: 0, page: 1, limit: 10, pages: 0,
};

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem('tfx_auth');
  if (!raw) return {};
  try {
    const { accessToken } = JSON.parse(raw) as { accessToken?: string };
    if (!accessToken) return {};
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  } catch {
    return {};
  }
}

function buildQuery(params?: CustomBookingQueryParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const CustomBookingAPI = {
  // ── Tourist ───────────────────────────────────────────────────────────────

  async create(data: CreateCustomBookingInput): Promise<CustomBooking> {
    const res = await fetch(`${API_URL}/custom-bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(err.message ?? 'Failed to submit custom booking');
    }
    return res.json() as Promise<CustomBooking>;
  },

  async getMy(query?: CustomBookingQueryParams): Promise<CustomBooking[]> {
    try {
      const res = await fetch(`${API_URL}/custom-bookings/my${buildQuery(query)}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : (data?.data ?? []);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<CustomBooking | null> {
    try {
      const res = await fetch(`${API_URL}/custom-bookings/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return null;
      return res.json() as Promise<CustomBooking>;
    } catch {
      return null;
    }
  },

  async update(id: string, data: Partial<CreateCustomBookingInput>): Promise<CustomBooking> {
    const res = await fetch(`${API_URL}/custom-bookings/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(err.message ?? 'Failed to update custom booking');
    }
    return res.json() as Promise<CustomBooking>;
  },

  async cancel(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/custom-bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to cancel custom booking');
  },

  // ── Offers ────────────────────────────────────────────────────────────────

  async getOffers(customBookingId: string): Promise<DriverOffer[]> {
    try {
      const res = await fetch(`${API_URL}/custom-bookings/${customBookingId}/offers`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async acceptOffer(customBookingId: string, offerId: string): Promise<CustomBooking> {
    const res = await fetch(
      `${API_URL}/custom-bookings/${customBookingId}/offers/${offerId}/accept`,
      { method: 'POST', headers: getAuthHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(err.message ?? 'Failed to accept offer');
    }
    return res.json() as Promise<CustomBooking>;
  },

  async rejectOffer(customBookingId: string, offerId: string): Promise<DriverOffer> {
    const res = await fetch(
      `${API_URL}/custom-bookings/${customBookingId}/offers/${offerId}/reject`,
      { method: 'POST', headers: getAuthHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(err.message ?? 'Failed to reject offer');
    }
    return res.json() as Promise<DriverOffer>;
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  async getAll(query?: CustomBookingQueryParams): Promise<CustomBookingPaginationResponse> {
    try {
      const res = await fetch(`${API_URL}/custom-bookings${buildQuery(query)}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return EMPTY_PAGE;
      return res.json() as Promise<CustomBookingPaginationResponse>;
    } catch {
      return EMPTY_PAGE;
    }
  },

  async updateStatus(id: string, status: string): Promise<CustomBooking> {
    const res = await fetch(`${API_URL}/custom-bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(err.message ?? 'Failed to update status');
    }
    return res.json() as Promise<CustomBooking>;
  },
};
