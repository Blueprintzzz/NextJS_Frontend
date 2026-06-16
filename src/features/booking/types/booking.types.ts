export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'NOT_PAID' | 'PARTIAL' | 'PAID';

export interface BookingPassenger {
  id: string;
  bookingId: string;
  passengerName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber?: string;
  createdAt: string;
}

export interface BookingPayment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'ONLINE';
  paymentDate: string;
  transactionId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  tourPackageId: string;
  vehicleId?: string;
  startDate: string;
  endDate: string;
  numberOfPassengers: number;
  totalCost: number;
  advancePayment?: number;
  remainingAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  passengers: BookingPassenger[];
  payments: BookingPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePassengerInput {
  passengerName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber?: string;
}

export interface CreateBookingInput {
  tourPackageId: string;
  vehicleId?: string;
  startDate: string;
  endDate: string;
  numberOfPassengers: number;
  advancePayment?: number;
  specialRequests?: string;
  passengers: CreatePassengerInput[];
}

export interface BookingQueryParams {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface BookingPaginationResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}
