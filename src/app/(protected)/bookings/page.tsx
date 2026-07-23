'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge } from '@/features/booking/components/BookingStatusBadge';
import { PaymentStatusBadge } from '@/features/booking/components/PaymentStatusBadge';
import { useBookingData } from '@/features/booking/hooks/useBookingData';
import { formatCurrency, formatBookingNumber, calculateDays } from '@/features/booking/utils/booking.utils';
import type { BookingStatus } from '@/features/booking/types/booking.types';

type Tab = 'upcoming' | 'previous' | 'cancelled' | 'completed';

const TAB_CONFIG: { key: Tab; label: string; status?: BookingStatus }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'previous', label: 'All Bookings' },
  { key: 'completed', label: 'Completed', status: 'COMPLETED' },
  { key: 'cancelled', label: 'Cancelled', status: 'CANCELLED' },
];

export default function BookingHistoryPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [page, setPage] = useState(1);

  const activeConfig = TAB_CONFIG.find((t) => t.key === tab)!;
  const { data, isLoading, isError } = useBookingData({
    page,
    limit: 10,
    status: activeConfig.status,
  });

  // For "upcoming" tab, filter client-side for confirmed future bookings
  const rows = tab === 'upcoming'
    ? data.data.filter((b) => b.status === 'CONFIRMED' && new Date(b.startDate) >= new Date())
    : data.data;

  const handleTabChange = (t: Tab) => { setTab(t); setPage(1); };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Booking History</h1>
        <Link href="/bookings/create"><Button size="sm">+ New Booking</Button></Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit overflow-x-auto">
        {TAB_CONFIG.map((t) => (
          <button key={t.key} onClick={() => handleTabChange(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {isError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">Failed to load bookings.</p>}

      {isLoading && (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-md bg-gray-100 animate-pulse" />)}</div>
      )}

      {!isLoading && (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Booking #', 'Dates', 'Passengers', 'Total', 'Status', 'Payment', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  {tab === 'upcoming' ? 'No upcoming trips. ' : 'No bookings found. '}
                  <Link href="/tours" className="text-teal-600 hover:underline">Browse tours →</Link>
                </td></tr>
              )}
              {rows.map((b) => (
                <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-teal-700">{formatBookingNumber(b.bookingNumber)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    <span className="ml-1 text-xs text-gray-400">({calculateDays(b.startDate, b.endDate)}d)</span>
                  </td>
                  <td className="px-4 py-3">{b.numberOfPassengers}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(b.totalCost)}</td>
                  <td className="px-4 py-3"><BookingStatusBadge status={b.status} /></td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={b.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/bookings/${b.id}`}><Button variant="ghost" size="sm">View</Button></Link>
                      {b.status === 'COMPLETED' && (
                        <Link href={`/bookings/${b.id}/review`}><Button variant="outline" size="sm">Review</Button></Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && data.pages > 1 && tab !== 'upcoming' && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Page {data.page} of {data.pages} · {data.total} total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
