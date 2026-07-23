'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { useAllBookings, BookingStatusBadge, PaymentStatusBadge } from '@/features/booking';
import type { BookingStatus, PaymentStatus } from '@/features/booking';

const STATUS_OPTIONS: (BookingStatus | '')[] = ['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const PAYMENT_OPTIONS: (PaymentStatus | '')[] = ['', 'NOT_PAID', 'PARTIAL', 'PAID'];

export default function AdminBookingsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAllBookings({
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    page,
    limit: 15,
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>

      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={e => { setStatus(e.target.value as BookingStatus | ''); setPage(1); }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select
          value={paymentStatus}
          onChange={e => { setPaymentStatus(e.target.value as PaymentStatus | ''); setPage(1); }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {PAYMENT_OPTIONS.map(s => <option key={s} value={s}>{s || 'All Payments'}</option>)}
        </select>
        <span className="ml-auto text-sm text-gray-500 self-center">
          {data.total} booking{data.total !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Booking #', 'Passengers', 'Dates', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              : data.data.length === 0
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No bookings found.</td></tr>
              : data.data.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{b.bookingNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{b.numberOfPassengers}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">${b.totalCost.toLocaleString()}</td>
                    <td className="px-4 py-3"><BookingStatusBadge status={b.status} /></td>
                    <td className="px-4 py-3"><PaymentStatusBadge status={b.paymentStatus} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => router.push(`/bookings/${b.id}`)}
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {data.pages}</span>
          <button
            onClick={() => setPage(p => Math.min(data.pages, p + 1))}
            disabled={page === data.pages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
