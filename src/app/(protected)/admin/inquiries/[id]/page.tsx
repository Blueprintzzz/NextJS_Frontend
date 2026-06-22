'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useInquiryById } from '@/features/inquiry';
import { InquiryStatusBadge, InquiryPriorityBadge } from '@/features/inquiry';

export default function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: inquiry, isLoading } = useInquiryById(id);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/inquiries">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Inquiry Detail</h1>
      </div>

      {isLoading && <p className="text-gray-500">Loading...</p>}

      {inquiry && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <InquiryStatusBadge status={inquiry.status} />
            <InquiryPriorityBadge priority={inquiry.priority} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{inquiry.subject}</h2>
          <p className="text-gray-600">{inquiry.message}</p>
          <div className="text-sm text-gray-400">
            From: {inquiry.name} — {inquiry.email}
          </div>
        </div>
      )}
    </div>
  );
}
