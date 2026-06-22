import { apiRequest } from '@/lib/api';
import type {
  Booking,
  BookingPaginationResponse,
  BookingPayment,
  BookingQueryParams,
  CreateBookingInput,
  CreatePassengerInput,
  BookingPassenger,
} from '../types/booking.types';

const EMPTY_PAGE: BookingPaginationResponse = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

function buildQuery(params?: BookingQueryParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const BookingAPI = {
  // READ — never throw
  async getUserBookings(query?: BookingQueryParams): Promise<BookingPaginationResponse> {
    try {
      const raw = await apiRequest(`/bookings${buildQuery(query)}`);
      return (raw as BookingPaginationResponse) ?? EMPTY_PAGE;
    } catch {
      return EMPTY_PAGE;
    }
  },

  async getAllBookings(query?: BookingQueryParams): Promise<BookingPaginationResponse> {
    try {
      const raw = await apiRequest(`/bookings${buildQuery(query)}`);
      return (raw as BookingPaginationResponse) ?? EMPTY_PAGE;
    } catch {
      return EMPTY_PAGE;
    }
  },

  async getMyBookings(query?: BookingQueryParams): Promise<BookingPaginationResponse> {
    try {
      const raw = await apiRequest(`/bookings/user${buildQuery(query)}`);
      return (raw as BookingPaginationResponse) ?? EMPTY_PAGE;
    } catch {
      return EMPTY_PAGE;
    }
  },

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      return (await apiRequest(`/bookings/${id}`)) as Booking;
    } catch {
      return null;
    }
  },

  async getBookingByNumber(bookingNumber: string): Promise<Booking | null> {
    try {
      return (await apiRequest(`/bookings/number/${bookingNumber}`)) as Booking;
    } catch {
      return null;
    }
  },

  async getPaymentHistory(bookingId: string): Promise<BookingPayment[]> {
    try {
      const raw = await apiRequest(`/bookings/${bookingId}/payments`);
      return Array.isArray(raw) ? (raw as BookingPayment[]) : [];
    } catch {
      return [];
    }
  },

  // WRITE — always throw
  async createBooking(data: CreateBookingInput): Promise<Booking> {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<Booking>;
  },

  async updateBooking(id: string, data: Partial<CreateBookingInput>): Promise<Booking> {
    return apiRequest(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<Booking>;
  },

  async cancelBooking(id: string): Promise<Booking> {
    return apiRequest(`/bookings/${id}/cancel`, { method: 'POST' }) as Promise<Booking>;
  },

  async deleteBooking(id: string): Promise<void> {
    await apiRequest(`/bookings/${id}`, { method: 'DELETE' });
  },

  async addPassenger(bookingId: string, passengerData: CreatePassengerInput): Promise<BookingPassenger> {
    return apiRequest(`/bookings/${bookingId}/passengers`, {
      method: 'POST',
      body: JSON.stringify(passengerData),
    }) as Promise<BookingPassenger>;
  },

  async removePassenger(bookingId: string, passengerId: string): Promise<void> {
    await apiRequest(`/bookings/${bookingId}/passengers/${passengerId}`, { method: 'DELETE' });
  },

  async recordPayment(
    bookingId: string,
    data: { amount: number; paymentMethod: string; transactionId?: string }
  ): Promise<BookingPayment> {
    return apiRequest(`/bookings/${bookingId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<BookingPayment>;
  },
};
