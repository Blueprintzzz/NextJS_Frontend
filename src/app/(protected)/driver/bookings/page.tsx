'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge, PaymentStatusBadge, useBookingData, formatCurrency, formatBookingNumber, calculateDays } from '@/features/booking';
import type { BookingStatus } from '@/features/booking';

const TABS: { label: string; status: BookingStatus }[] = [
  { label: 'Confirmed', status: 'CONFIRMED' },
  { label: 'Upcoming', status: 'PENDING' },
  { label: 'Completed', status: 'COMPLETED' },
  { label: 'Cancelled', status: 'CANCELLED' },
];

export default function DriverBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('CONFIRMED');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBookingData({ status: activeTab, page, limit: 10 });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.status}
            onClick={() => { setActiveTab(t.status); setPage(1); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t.status ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-md bg-gray-100 animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Booking #', 'Dates', 'Passengers', 'Total', 'Status', 'Payment', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No {activeTab.toLowerCase()} bookings.</td></tr>
              ) : data.data.map((b) => (
                <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-teal-700">{formatBookingNumber(b.bookingNumber)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    <span className="ml-1 text-xs text-gray-400">({calculateDays(b.startDate, b.endDate)}d)</span>
                  </td>
                  <td className="px-4 py-3">{b.numberOfPassengers}</td>
                  <td className="px-4 py-3">{formatCurrency(b.totalCost)}</td>
                  <td className="px-4 py-3"><BookingStatusBadge status={b.status} /></td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={b.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/bookings/${b.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && data.pages > 1 && (
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
