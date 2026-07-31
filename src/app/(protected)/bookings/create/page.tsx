'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreateBookingForm } from '@/features/booking';

function BookingPageInner() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId') ?? undefined;
  const guests    = searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bookings">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Book a Tour</h1>
          <p className="text-sm text-gray-400">Complete the steps below to confirm your booking.</p>
        </div>
      </div>
      <CreateBookingForm initialPackageId={packageId} initialGuests={guests} />
    </div>
  );
}

export default function CreateBookingPage() {
  return (
    <Suspense>
      <BookingPageInner />
    </Suspense>
  );
}
