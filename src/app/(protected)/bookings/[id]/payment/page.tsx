'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingById, PaymentForm, formatCurrency } from '@/features/booking';

export default function RecordPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: booking, isLoading } = useBookingById(id);

  if (isLoading) return null;
  if (!booking) return <p className="p-8 text-sm text-red-600">Booking not found.</p>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/bookings/${id}`}>
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Record Payment</h1>
      </div>

      <div className="mb-4 rounded-md bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
        Booking <span className="font-mono font-medium">{booking.bookingNumber}</span> —
        remaining balance: <span className="font-bold">{formatCurrency(booking.remainingAmount)}</span>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Payment Details</CardTitle></CardHeader>
        <CardContent>
          <PaymentForm
            bookingId={id}
            remainingAmount={booking.remainingAmount}
            onSuccess={() => router.push(`/bookings/${id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
