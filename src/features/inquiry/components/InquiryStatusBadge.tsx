'use client';

import { STATUS_COLORS } from '../utils/inquiry.utils';
import type { InquiryStatus } from '../types/inquiry.types';

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}
