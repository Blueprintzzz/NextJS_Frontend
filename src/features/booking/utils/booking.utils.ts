import type { Booking, BookingStatus, PaymentStatus, CreatePassengerInput, ValidationError } from '../types/booking.types';

export const getBookingStatusLabel = (status: BookingStatus): string => ({
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
}[status]);

export const getBookingStatusColor = (status: BookingStatus): 'default' | 'success' | 'warning' | 'destructive' => ({
  PENDING: 'warning' as const,
  CONFIRMED: 'default' as const,
  COMPLETED: 'success' as const,
  CANCELLED: 'destructive' as const,
}[status]);

export const getPaymentStatusLabel = (status: PaymentStatus): string => ({
  NOT_PAID: 'Not Paid',
  PARTIAL: 'Partial',
  PAID: 'Paid',
}[status]);

export const getPaymentStatusColor = (status: PaymentStatus): 'default' | 'success' | 'warning' | 'destructive' => ({
  NOT_PAID: 'destructive' as const,
  PARTIAL: 'warning' as const,
  PAID: 'success' as const,
}[status]);

export const formatBookingNumber = (number: string): string => number;

export const calculateDays = (startDate: string, endDate: string): number => {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const canCancelBooking = (booking: Booking): boolean =>
  booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED';

export const canDeleteBooking = (booking: Booking): boolean => booking.status === 'PENDING';

export const canRecordPayment = (booking: Booking, amount: number): boolean =>
  amount > 0 && amount <= booking.remainingAmount && booking.status !== 'CANCELLED';

export const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const validatePassenger = (p: CreatePassengerInput): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!p.passengerName.trim()) errors.push({ field: 'passengerName', message: 'Name is required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors.push({ field: 'email', message: 'Invalid email' });
  if (!/^\+?[\d\s\-()]{7,15}$/.test(p.phone)) errors.push({ field: 'phone', message: 'Invalid phone number' });
  if (!p.dateOfBirth || new Date(p.dateOfBirth) >= new Date()) errors.push({ field: 'dateOfBirth', message: 'Date of birth must be in the past' });
  return errors;
};
