'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/features/permissions';
import { EditBookingForm } from '@/features/booking';

export default function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading } = usePermissions();
  if (loading) return null;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/bookings/${id}`}>
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Edit Booking</h1>
      </div>
      <EditBookingForm bookingId={id} />
    </div>
  );
}
