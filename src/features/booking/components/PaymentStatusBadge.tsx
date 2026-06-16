'use client';

import { getPaymentStatusLabel, getPaymentStatusColor } from '../utils/booking.utils';
import type { PaymentStatus } from '../types/booking.types';

const colorMap = {
  default: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  destructive: 'bg-red-100 text-red-800',
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[getPaymentStatusColor(status)]}`}>
      {getPaymentStatusLabel(status)}
    </span>
  );
}
