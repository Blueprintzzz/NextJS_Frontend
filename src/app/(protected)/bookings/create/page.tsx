'use client';

import { usePermissions } from '@/features/permissions';
import { CreateBookingForm } from '@/features/booking';

export default function CreateBookingPage() {
  const { loading } = usePermissions();
  if (loading) return null;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New Booking</h1>
      <CreateBookingForm />
    </div>
  );
}
