'use client';

import Link from 'next/link';
import { CustomBookingAPI } from '../api/customBooking.api';
import type { CustomBooking } from '../types/customBooking.types';

const STATUS_COLORS: Record<string, string> = {
  PENDING:        'bg-yellow-50 text-yellow-700 border-yellow-200',
  OFFER_RECEIVED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONFIRMED:      'bg-teal-50 text-teal-700 border-teal-200',
  IN_PROGRESS:    'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED:      'bg-green-50 text-green-700 border-green-200',
  CANCELLED:      'bg-gray-50 text-gray-500 border-gray-200',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:        'Pending',
  OFFER_RECEIVED: 'Offer Received',
  CONFIRMED:      'Confirmed',
  IN_PROGRESS:    'In Progress',
  COMPLETED:      'Completed',
  CANCELLED:      'Cancelled',
};

export function CustomBookingCard({
  booking,
  onCancel,
  basePath = '/custom-bookings',
}: {
  booking: CustomBooking;
  onCancel?: () => void;
  /** Override link base path — use '/admin/custom-bookings' for admin view */
  basePath?: string;
}) {
  const colorCls  = STATUS_COLORS[booking.status] ?? STATUS_COLORS.PENDING;
  const offerCount = booking._count?.offers ?? booking.offers?.length ?? 0;

  async function handleCancel() {
    if (!confirm('Cancel this custom tour request?')) return;
    try {
      await CustomBookingAPI.cancel(booking.id);
      onCancel?.();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to cancel');
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 text-sm truncate">{booking.title}</p>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorCls}`}
          >
            {STATUS_LABELS[booking.status] ?? booking.status}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-0.5">{booking.bookingNumber}</p>

        {/* Tourist name — shown in admin view */}
        {booking.user && (
          <p className="text-xs text-gray-500 mt-0.5">
            👤 {booking.user.firstName} {booking.user.lastName}
          </p>
        )}

        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          <span>👥 {booking.numberOfPeople} people</span>
          {booking.budget && <span>💰 ${booking.budget.toLocaleString()}</span>}
          <span>📅 {new Date(booking.startDate).toLocaleDateString()}</span>
          {offerCount > 0 && (
            <span className="text-blue-600 font-medium">
              🚗 {offerCount} offer{offerCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {booking.destinations && (booking.destinations as string[]).length > 0 && (
          <p className="text-xs text-gray-400 mt-1.5 truncate">
            📍 {(booking.destinations as string[]).slice(0, 3).join(', ')}
            {(booking.destinations as string[]).length > 3 &&
              ` +${(booking.destinations as string[]).length - 3} more`}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`${basePath}/${booking.id}`}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          View Details
        </Link>
        {booking.status === 'PENDING' && basePath !== '/admin/custom-bookings' && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
