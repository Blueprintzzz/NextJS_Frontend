'use client';

import { PRIORITY_COLORS } from '../utils/inquiry.utils';
import type { InquiryPriority } from '../types/inquiry.types';

export function InquiryPriorityBadge({ priority }: { priority: InquiryPriority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[priority]}`}>
      {priority}
    </span>
  );
}
