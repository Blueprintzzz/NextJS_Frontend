'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CustomBookingAPI } from '../api/customBooking.api';
import { OfferCard } from './OfferCard';
import type { CustomBooking, CustomBookingStatus } from '../types/customBooking.types';

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

const ALL_STATUSES: CustomBookingStatus[] = [
  'PENDING', 'OFFER_RECEIVED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED',
];

export function CustomBookingDetail({
  booking,
  onUpdate,
  isAdmin = false,
}: {
  booking: CustomBooking;
  onUpdate?: () => void;
  /** Set true to show admin-only controls (status updater) */
  isAdmin?: boolean;
}) {
  const [actionError,   setActionError]   = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // tracks which offer id is acting
  const [statusLoading, setStatusLoading] = useState(false);

  const colorCls   = STATUS_COLORS[booking.status] ?? STATUS_COLORS.PENDING;
  const offers     = booking.offers ?? [];
  const canAct     = booking.status === 'OFFER_RECEIVED' || booking.status === 'PENDING';

  async function handleAccept(offerId: string) {
    setActionError(null);
    setActionLoading(offerId);
    try {
      await CustomBookingAPI.acceptOffer(booking.id, offerId);
      onUpdate?.();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to accept offer');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(offerId: string) {
    setActionError(null);
    setActionLoading(offerId);
    try {
      await CustomBookingAPI.rejectOffer(booking.id, offerId);
      onUpdate?.();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to reject offer');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleStatusChange(status: string) {
    if (!confirm(`Change status to "${STATUS_LABELS[status] ?? status}"?`)) return;
    setActionError(null);
    setStatusLoading(true);
    try {
      await CustomBookingAPI.updateStatus(booking.id, status);
      onUpdate?.();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href={isAdmin ? '/admin/custom-bookings' : '/custom-bookings'}
          className="text-sm text-teal-600 hover:underline"
        >
          ← Back to {isAdmin ? 'all requests' : 'my requests'}
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{booking.title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{booking.bookingNumber}</p>
            {booking.user && isAdmin && (
              <p className="text-sm text-gray-500 mt-1">
                👤 {booking.user.firstName} {booking.user.lastName} — {booking.user.email}
                {booking.user.phone && ` · ${booking.user.phone}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorCls}`}
            >
              {STATUS_LABELS[booking.status] ?? booking.status}
            </span>

            {/* Admin status updater */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <select
                  defaultValue=""
                  onChange={(e) => { if (e.target.value) handleStatusChange(e.target.value); }}
                  disabled={statusLoading}
                  className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 disabled:opacity-50"
                >
                  <option value="" disabled>Change status…</option>
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s} disabled={s === booking.status}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                {statusLoading && (
                  <span className="w-4 h-4 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Start Date</p>
            <p className="font-medium text-gray-800">{new Date(booking.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">End Date</p>
            <p className="font-medium text-gray-800">{new Date(booking.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">People</p>
            <p className="font-medium text-gray-800">{booking.numberOfPeople}</p>
          </div>
          {booking.budget && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Budget</p>
              <p className="font-medium text-gray-800">${booking.budget.toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Vehicle Type</p>
            <p className="font-medium text-gray-800">{booking.requestedVehicleType}</p>
          </div>
          {booking.requestedModel && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Requested Model</p>
              <p className="font-medium text-gray-800">{booking.requestedModel.name}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Pickup</p>
            <p className="font-medium text-gray-800">{booking.pickupLocation}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dropoff</p>
            <p className="font-medium text-gray-800">{booking.dropoffLocation}</p>
          </div>
        </div>

        {/* Destinations */}
        {(booking.destinations as string[]).length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1.5">Destinations</p>
            <div className="flex flex-wrap gap-1.5">
              {(booking.destinations as string[]).map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-xl text-xs font-medium"
                >
                  📍 {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {booking.description && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1">Request Details</p>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-xl p-4">
              {booking.description}
            </pre>
          </div>
        )}

        {/* Requirements */}
        {booking.requirements && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1">Special Requirements</p>
            <p className="text-sm text-gray-700 leading-relaxed">{booking.requirements}</p>
          </div>
        )}
      </div>

      {/* Offers */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Driver Offers
          {offers.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({offers.length})</span>
          )}
        </h2>

        {actionError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            {actionError}
          </div>
        )}

        {offers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-3xl mb-2">🚗</p>
            <p className="text-sm text-gray-500">
              {booking.status === 'PENDING'
                ? 'No offers yet — drivers will send their proposals shortly.'
                : 'No offers were made for this request.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="relative">
                {actionLoading === offer.id && (
                  <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center z-10">
                    <span className="w-5 h-5 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
                  </div>
                )}
                <OfferCard
                  offer={offer}
                  isSelected={booking.selectedOfferId === offer.id}
                  canAct={canAct && !isAdmin}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
