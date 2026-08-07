'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem('tfx_auth');
  if (!raw) return {};
  const { accessToken } = JSON.parse(raw);
  return { Authorization: `Bearer ${accessToken}` };
}

export default function DriverBookingRequestsPage() {
  const [standardBookings, setStandardBookings] = useState<any[]>([]);
  const [availableCustom, setAvailableCustom] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [driverVehicles, setDriverVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'standard' | 'available' | 'my-offers'>('available');

  const [offerInputs, setOfferInputs] = useState<Record<string, { price: string; message: string; mobile: string }>>({}); 
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const headers = getAuthHeaders();
      const [std, avail, offers] = await Promise.all([
        fetch(`${API_URL}/bookings/driver/me?status=PENDING&limit=20`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_URL}/custom-bookings/driver/available?limit=20`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_URL}/custom-bookings/driver/my-offers?limit=20`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      ]);
      setStandardBookings(std?.data ?? []);
      setAvailableCustom(avail?.data ?? []);
      setMyOffers(offers?.data ?? []);
      fetch(`${API_URL}/vehicles/driver/me`, { headers })
        .then(r => r.json())
        .then(d => setDriverVehicles(Array.isArray(d) ? d : d?.data ?? []))
        .catch(() => {});
      setLoading(false);
    }
    load();
  }, []);

  async function acceptBooking(bookingId: string) {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      });
      if (!res.ok) throw new Error('Failed to confirm booking');
      setStandardBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to confirm booking');
    }
  }

  async function submitOffer(customBookingId: string, vehicleId: string) {
    const input = offerInputs[customBookingId];
    if (!input?.price) { setSubmitError('Please enter a price'); return; }
    setSubmitting(customBookingId);
    setSubmitError(null);
    try {
      const res = await fetch(`${API_URL}/custom-bookings/${customBookingId}/offers`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          price: Number(input.price),
          message: input.message
            ? `${input.message} | Contact: ${input.mobile}`
            : `Contact: ${input.mobile}`,
          validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to submit offer');
      }
      setSubmitSuccess(customBookingId);
      setAvailableCustom(prev => prev.filter(b => b.id !== customBookingId));
      fetch(`${API_URL}/custom-bookings/driver/my-offers?limit=20`, { headers: getAuthHeaders() })
        .then(r => r.json())
        .then(d => setMyOffers(d?.data ?? []));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit offer');
    } finally {
      setSubmitting(null);
    }
  }

  const tabs = [
    { key: 'available', label: 'Available Requests', count: availableCustom.length },
    { key: 'my-offers', label: 'Submitted Offers', count: myOffers.length },
    { key: 'standard', label: 'Standard Bookings', count: standardBookings.length },
  ];

  const statusColors: Record<string, string> = {
    PENDING:  'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    EXPIRED:  'bg-gray-100 text-gray-600',
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.key
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === tab.key ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* ── Tab 1: Available Custom Booking Requests ── */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              {availableCustom.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg font-medium">No available requests</p>
                  <p className="text-sm mt-1">Custom tour requests matching your vehicles will appear here.</p>
                </div>
              ) : availableCustom.map(booking => {
                const input = offerInputs[booking.id] ?? { price: '', message: '', mobile: '' };
                const isSubmitting = submitting === booking.id;
                const isSuccess = submitSuccess === booking.id;
                return (
                  <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {new Date(booking.startDate).toLocaleDateString()} {' – '} {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">People</p>
                        <p className="font-semibold text-gray-800">{booking.numberOfPeople}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Vehicle Type</p>
                        <p className="font-semibold text-gray-800">{booking.requestedVehicleType}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Model</p>
                        <p className="font-semibold text-gray-800">{booking.requestedModel?.name ?? '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Budget</p>
                        <p className="font-semibold text-gray-800">
                          {booking.budget ? `$${Number(booking.budget).toFixed(0)}` : 'Flexible'}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Pickup:</span> {booking.pickupLocation}</p>
                      <p><span className="font-medium">Dropoff:</span> {booking.dropoffLocation}</p>
                      {booking.requirements && (
                        <p><span className="font-medium">Notes:</span> {booking.requirements}</p>
                      )}
                    </div>

                    {isSuccess ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                        <span className="text-green-600 text-sm font-medium">✓ Offer submitted successfully</span>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-1 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submit Your Offer</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Your Price (USD) *</label>
                            <input
                              type="number"
                              placeholder="e.g. 450"
                              value={input.price}
                              onChange={e => setOfferInputs(prev => ({ ...prev, [booking.id]: { ...input, price: e.target.value } }))}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Your Mobile Number *</label>
                            <input
                              type="tel"
                              placeholder="e.g. +94 77 123 4567"
                              value={input.mobile ?? ''}
                              onChange={e => setOfferInputs(prev => ({ ...prev, [booking.id]: { ...input, mobile: e.target.value } }))}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Message (optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. AC vehicle, experienced driver"
                              value={input.message}
                              onChange={e => setOfferInputs(prev => ({ ...prev, [booking.id]: { ...input, message: e.target.value } }))}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>

                        {submitError && submitting === null && (
                          <p className="text-xs text-red-600">{submitError}</p>
                        )}

                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Select Your Vehicle *</label>
                          <select
                            id={`vehicle-${booking.id}`}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            defaultValue=""
                          >
                            <option value="" disabled>Select your vehicle</option>
                            {driverVehicles
                              .filter(v =>
                                v.type === booking.requestedVehicleType ||
                                v.vehicleModelId === booking.requestedModelId
                              )
                              .map(v => (
                                <option key={v.id} value={v.id}>
                                  {v.vehicleModelName ?? v.type} — {v.registrationNumber}
                                </option>
                              ))
                            }
                          </select>
                          <p className="text-xs text-gray-400 mt-1">
                            Only vehicles matching {booking.requestedVehicleType}
                            {booking.requestedModel ? ` / ${booking.requestedModel.name}` : ''} are shown
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const sel = document.getElementById(`vehicle-${booking.id}`) as HTMLSelectElement;
                            submitOffer(booking.id, sel?.value ?? '');
                          }}
                          disabled={isSubmitting}
                          className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting ? 'Submitting…' : 'Submit Offer'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Tab 2: My Submitted Offers ── */}
          {activeTab === 'my-offers' && (
            <div className="space-y-4">
              {myOffers.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg font-medium">No offers yet</p>
                  <p className="text-sm mt-1">Your submitted offers will appear here.</p>
                </div>
              ) : myOffers.map(booking => {
                const myOffer = booking.offers?.[0];
                return (
                  <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {new Date(booking.startDate).toLocaleDateString()} {' – '} {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          Booking: {booking.status}
                        </span>
                        {myOffer && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[myOffer.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            Offer: {myOffer.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {myOffer && (
                      <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 space-y-1">
                        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Your Offer</p>
                        <p className="text-sm text-teal-800 font-bold">${Number(myOffer.price).toFixed(2)}</p>
                        {myOffer.message && <p className="text-xs text-teal-600">{myOffer.message}</p>}
                        {myOffer.eta && <p className="text-xs text-teal-500">ETA: {myOffer.eta}</p>}
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">People</p>
                        <p className="font-semibold">{booking.numberOfPeople}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Vehicle Type</p>
                        <p className="font-semibold">{booking.requestedVehicleType}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Model</p>
                        <p className="font-semibold">{booking.requestedModel?.name ?? '—'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Tab 3: Standard Bookings ── */}
          {activeTab === 'standard' && (
            <div className="space-y-4">
              {standardBookings.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg font-medium">No pending bookings</p>
                  <p className="text-sm mt-1">Standard bookings for your vehicles will appear here.</p>
                </div>
              ) : standardBookings.map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-teal-700 font-semibold">{b.bookingNumber}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(b.startDate).toLocaleDateString()} {' – '} {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Passengers</p>
                      <p className="font-semibold">{b.numberOfPassengers}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Total Cost</p>
                      <p className="font-semibold">${Number(b.totalCost).toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Package</p>
                      <p className="font-semibold truncate">{b.tourPackage?.name ?? '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Vehicle</p>
                      <p className="font-semibold">{b.vehicle?.vehicleModel?.name ?? b.vehicle?.type ?? '—'}</p>
                    </div>
                  </div>

                  {b.specialRequests && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Special requests:</span> {b.specialRequests}
                    </p>
                  )}

                  {b.status === 'PENDING' && (
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => acceptBooking(b.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        ✓ Accept Booking
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reject this booking?')) {
                            fetch(`${API_URL}/bookings/${b.id}/cancel`, {
                              method: 'POST',
                              headers: getAuthHeaders(),
                            }).then(() => {
                              setStandardBookings(prev => prev.filter(booking => booking.id !== b.id));
                            });
                          }
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}

                  {b.status === 'CONFIRMED' && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        ✓ Booking Confirmed
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
