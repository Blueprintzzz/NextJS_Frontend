'use client';

import { getBookingStatusLabel, getBookingStatusColor } from '../utils/booking.utils';
import type { BookingStatus } from '../types/booking.types';

const colorMap = {
  default: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  destructive: 'bg-red-100 text-red-800',
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[getBookingStatusColor(status)]}`}>
      {getBookingStatusLabel(status)}
    </span>
  );
}
