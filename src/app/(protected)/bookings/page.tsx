'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/features/permissions';
import { BookingList } from '@/features/booking';

export default function BookingsPage() {
  const { loading } = usePermissions();
  if (loading) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
        <Link href="/bookings/create">
          <Button>+ New Booking</Button>
        </Link>
      </div>
      <BookingList />
    </div>
  );
}
