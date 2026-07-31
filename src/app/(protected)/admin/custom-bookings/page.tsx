'use client';

import { useState } from 'react';
import { CustomBookingAPI }  from '@/features/customBooking';
import { CustomBookingCard } from '@/features/customBooking';
import type { CustomBookingStatus } from '@/features/customBooking';
import { useEffect, useCallback } from 'react';
import type { CustomBooking, CustomBookingPaginationResponse } from '@/features/customBooking';

const STATUS_OPTIONS: { label: string; value: CustomBookingStatus | '' }[] = [
  { label: 'All',            value: '' },
  { label: 'Pending',        value: 'PENDING' },
  { label: 'Offer Received', value: 'OFFER_RECEIVED' },
  { label: 'Confirmed',      value: 'CONFIRMED' },
  { label: 'In Progress',    value: 'IN_PROGRESS' },
  { label: 'Completed',      value: 'COMPLETED' },
  { label: 'Cancelled',      value: 'CANCELLED' },
];

export default function AdminCustomBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<CustomBookingStatus | ''>('');
  const [page, setPage]                 = useState(1);
  const [result, setResult]             = useState<CustomBookingPaginationResponse>({
    data: [], total: 0, page: 1, limit: 10, pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CustomBookingAPI.getAll({
        ...(statusFilter ? { status: statusFilter } : {}),
        page,
        limit: 10,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 when filter changes
  function handleStatusChange(value: CustomBookingStatus | '') {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Custom Tour Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          All custom booking requests from tourists
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value as CustomBookingStatus | '')}
            className={[
              'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors',
              statusFilter === opt.value
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          Loading…
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && result.data.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm">No custom booking requests found.</p>
        </div>
      )}

      <div className="space-y-4">
        {result.data.map((booking: CustomBooking) => (
          <CustomBookingCard
            key={booking.id}
            booking={booking}
            basePath="/admin/custom-bookings"
            onCancel={load}
          />
        ))}
      </div>

      {/* Pagination */}
      {result.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {result.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(result.pages, p + 1))}
            disabled={page === result.pages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Total count */}
      {result.total > 0 && (
        <p className="text-center text-xs text-gray-400 mt-4">
          {result.total} total request{result.total !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
