export { BookingList } from './components/BookingList';
export { BookingDetail } from './components/BookingDetail';
export { CreateBookingForm } from './components/CreateBookingForm';
export { EditBookingForm } from './components/EditBookingForm';
export { PassengerForm } from './components/PassengerForm';
export { PassengerList } from './components/PassengerList';
export { PaymentForm } from './components/PaymentForm';
export { PaymentHistory } from './components/PaymentHistory';
export { BookingStatusBadge } from './components/BookingStatusBadge';
export { PaymentStatusBadge } from './components/PaymentStatusBadge';

export { useBookingData, useAllBookings, useBookingById } from './hooks/useBookingData';
export { useCreateBooking } from './hooks/useCreateBooking';
export { useUpdateBooking } from './hooks/useUpdateBooking';
export { useCancelBooking } from './hooks/useCancelBooking';
export { usePaymentRecording } from './hooks/usePaymentRecording';
export { useAddPassenger, useRemovePassenger } from './hooks/usePassengerManagement';

export { BookingAPI } from './api/booking.api';

export {
  formatCurrency,
  formatBookingNumber,
  getBookingStatusLabel,
  getBookingStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  calculateDays,
  canCancelBooking,
  canDeleteBooking,
  canRecordPayment,
  validatePassenger,
} from './utils/booking.utils';

export type {
  Booking,
  BookingStatus,
  PaymentStatus,
  BookingPassenger,
  BookingPayment,
  CreateBookingInput,
  CreatePassengerInput,
  BookingQueryParams,
  BookingPaginationResponse,
  ValidationError,
} from './types/booking.types';
