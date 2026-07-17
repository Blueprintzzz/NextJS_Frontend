'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreateBookingForm } from '@/features/booking';

export default function CreateBookingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bookings">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">New Booking</h1>
          <p className="text-sm text-gray-400">Fill in the details below to create a new booking.</p>
        </div>
      </div>

      {/* Form */}
      <CreateBookingForm />
    </div>
  );
}
