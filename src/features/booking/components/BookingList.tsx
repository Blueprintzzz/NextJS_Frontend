'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { useBookingData } from '../hooks/useBookingData';
import { formatCurrency, formatBookingNumber, calculateDays } from '../utils/booking.utils';
import type { BookingStatus, PaymentStatus } from '../types/booking.types';

const STATUS_OPTIONS: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export function BookingList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BookingStatus | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, isError } = useBookingData({ page, limit: 10, status, startDate: startDate || undefined, endDate: endDate || undefined });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Status</label>
          <select
            value={status ?? ''}
            onChange={(e) => { setStatus(e.target.value as BookingStatus || undefined); setPage(1); }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">From</label>
          <Input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="w-40" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">To</label>
          <Input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="w-40" />
        </div>
        {(status || startDate || endDate) && (
          <Button variant="ghost" size="sm" onClick={() => { setStatus(undefined); setStartDate(''); setEndDate(''); setPage(1); }}>
            Clear
          </Button>
        )}
      </div>

      {isError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">Failed to load bookings.</p>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-md bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Booking #', 'Dates', 'Passengers', 'Total', 'Status', 'Payment', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No bookings found.</td></tr>
              )}
              {data.data.map((b) => (
                <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-blue-700">{formatBookingNumber(b.bookingNumber)}</td>
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

      {/* Pagination */}
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
