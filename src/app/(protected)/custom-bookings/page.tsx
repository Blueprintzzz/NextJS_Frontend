'use client';

import { useMyCustomBookings } from '@/features/customBooking';
import { CustomBookingCard }   from '@/features/customBooking';
import Link from 'next/link';

export default function MyCustomBookingsPage() {
  const { data, loading, error, refetch } = useMyCustomBookings();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Custom Tour Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your custom tour requests and driver offers
          </p>
        </div>
        <Link
          href="/tours/customize"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          + New Request
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          Loading your custom bookings…
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">✈️</div>
          <p className="text-gray-500 text-sm">
            You haven&apos;t made any custom tour requests yet.
          </p>
          <Link
            href="/tours/customize"
            className="inline-block mt-4 text-teal-600 text-sm font-semibold hover:underline"
          >
            Create your first custom tour →
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {data.map((booking) => (
          <CustomBookingCard
            key={booking.id}
            booking={booking}
            onCancel={refetch}
          />
        ))}
      </div>
    </div>
  );
}
