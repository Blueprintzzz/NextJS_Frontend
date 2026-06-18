import type { InquiryStatus, InquiryPriority } from '../types/inquiry.types';

export const STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  RESPONDED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-700',
};

export const PRIORITY_COLORS: Record<InquiryPriority, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};
