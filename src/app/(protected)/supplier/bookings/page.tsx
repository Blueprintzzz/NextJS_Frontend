'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookingData, formatCurrency, formatBookingNumber, BookingStatusBadge } from '@/features/booking';
import type { BookingStatus } from '@/features/booking';

const STATUS_TABS: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function SupplierBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const { data, isLoading } = useBookingData({
    status: activeTab === 'ALL' ? undefined : activeTab,
    limit: 20,
  });

  const blockDate = () => {
    if (availabilityDate && !blockedDates.includes(availabilityDate)) {
      setBlockedDates((d) => [...d, availabilityDate].sort());
      setAvailabilityDate('');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Experience Bookings</h1>

      {/* Availability Manager */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Manage Availability</h2>
        </div>
        <p className="text-sm text-gray-500">Block dates when your experiences are unavailable.</p>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={availabilityDate}
            onChange={(e) => setAvailabilityDate(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" size="sm" onClick={blockDate} disabled={!availabilityDate}>
            Block Date
          </Button>
        </div>
        {blockedDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blockedDates.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                {d}
                <button onClick={() => setBlockedDates((prev) => prev.filter((x) => x !== d))} className="hover:text-red-900">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bookings */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.value
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No bookings found</p>
            <p className="text-sm mt-1">Bookings for your experiences will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.data.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-teal-700 font-semibold">{formatBookingNumber(b.bookingNumber)}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <BookingStatusBadge status={b.status} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Passengers</p>
                    <p className="font-semibold text-gray-800">{b.numberOfPassengers}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Total</p>
                    <p className="font-semibold text-gray-800">{formatCurrency(b.totalCost)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Special Requests</p>
                    <p className="font-semibold text-gray-800 truncate">{b.specialRequests || '—'}</p>
                  </div>
                </div>

                {b.status === 'PENDING' && (
                  <div className="flex items-center gap-3 pt-1">
                    <Button size="sm" className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700">
                      <CheckCircle className="w-4 h-4" /> Confirm
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.pages > 1 && (
          <p className="text-sm text-gray-500 text-center">
            Showing page {data.page} of {data.pages}
          </p>
        )}
      </div>
    </div>
  );
}
