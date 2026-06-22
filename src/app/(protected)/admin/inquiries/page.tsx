'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InquiryList } from '@/features/inquiry';

export default function AdminInquiriesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Manage Inquiries</h1>
      <InquiryList />
    </div>
  );
}
