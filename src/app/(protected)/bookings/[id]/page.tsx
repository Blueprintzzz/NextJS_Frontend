'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/features/permissions';
import { BookingDetail } from '@/features/booking';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading } = usePermissions();
  if (loading) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bookings">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Booking Details</h1>
      </div>
      <BookingDetail bookingId={id} />
    </div>
  );
}
