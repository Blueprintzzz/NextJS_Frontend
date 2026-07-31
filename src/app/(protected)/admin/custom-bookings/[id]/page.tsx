'use client';

import { use } from 'react';
import { useCustomBookingById } from '@/features/customBooking';
import { CustomBookingDetail }  from '@/features/customBooking';

export default function AdminCustomBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error, refetch } = useCustomBookingById(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-sm text-red-600">
        {error ?? 'Custom booking not found.'}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CustomBookingDetail booking={data} onUpdate={refetch} isAdmin />
    </div>
  );
}
