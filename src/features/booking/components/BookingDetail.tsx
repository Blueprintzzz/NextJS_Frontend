'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PassengerList } from './PassengerList';
import { PaymentHistory } from './PaymentHistory';
import { useBookingById } from '../hooks/useBookingData';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { formatCurrency, formatBookingNumber, calculateDays, canCancelBooking, canDeleteBooking } from '../utils/booking.utils';

interface BookingDetailProps {
  bookingId: string;
}

export function BookingDetail({ bookingId }: BookingDetailProps) {
  const router = useRouter();
  const { data: booking, isLoading, isError } = useBookingById(bookingId);
  const cancelMutation = useCancelBooking();
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (isLoading) return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse" />)}
    </div>
  );

  if (isError || !booking) return (
    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">Booking not found.</p>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold font-mono">{formatBookingNumber(booking.bookingNumber)}</h2>
          <div className="flex gap-2 mt-1">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
        </div>
        <div className="flex gap-2">
          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
            <Link href={`/bookings/${bookingId}/edit`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          )}
          {booking.remainingAmount > 0 && booking.status !== 'CANCELLED' && (
            <Link href={`/bookings/${bookingId}/payment`}>
              <Button size="sm">Record Payment</Button>
            </Link>
          )}
          {canCancelBooking(booking) && (
            <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => setConfirmCancel(true)}>
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader><CardTitle className="text-base">Booking Summary</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
          <div><p className="text-gray-500">Start Date</p><p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p></div>
          <div><p className="text-gray-500">End Date</p><p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p></div>
          <div><p className="text-gray-500">Duration</p><p className="font-medium">{calculateDays(booking.startDate, booking.endDate)} days</p></div>
          <div><p className="text-gray-500">Passengers</p><p className="font-medium">{booking.numberOfPassengers}</p></div>
          <div><p className="text-gray-500">Total Cost</p><p className="font-medium">{formatCurrency(booking.totalCost)}</p></div>
          <div><p className="text-gray-500">Remaining</p><p className="font-medium text-red-600">{formatCurrency(booking.remainingAmount)}</p></div>
          {booking.specialRequests && (
            <div className="col-span-full"><p className="text-gray-500">Special Requests</p><p className="font-medium">{booking.specialRequests}</p></div>
          )}
        </CardContent>
      </Card>

      {/* Passengers */}
      <Card>
        <CardHeader><CardTitle className="text-base">Passengers</CardTitle></CardHeader>
        <CardContent>
          <PassengerList booking={booking} editable={booking.status === 'PENDING' || booking.status === 'CONFIRMED'} />
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
        <CardContent>
          <PaymentHistory bookingId={bookingId} remainingAmount={booking.remainingAmount} editable={booking.status !== 'CANCELLED'} />
        </CardContent>
      </Card>

      {/* Cancel confirm dialog */}
      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel Booking?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">This action cannot be undone. Are you sure you want to cancel this booking?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(false)}>Keep Booking</Button>
            <Button
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate(bookingId, { onSuccess: () => { setConfirmCancel(false); router.push('/bookings'); } })}
            >
              {cancelMutation.isPending ? 'Cancelling…' : 'Yes, Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
