'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookingData } from '@/features/booking';
import { formatCurrency, formatBookingNumber, calculateDays } from '@/features/booking';

export default function DriverBookingRequestsPage() {
  const { data, isLoading } = useBookingData({ status: 'PENDING', limit: 20 });
  const [counterOffer, setCounterOffer] = useState<Record<string, string>>({});

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : data.data.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No pending requests</p>
          <p className="text-sm mt-1">New customized tour requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-teal-700 font-semibold">{formatBookingNumber(b.bookingNumber)}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    <span className="ml-1 text-gray-400">({calculateDays(b.startDate, b.endDate)} days)</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">PENDING</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Passengers</p>
                  <p className="font-semibold text-gray-800">{b.numberOfPassengers}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Suggested Price</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(b.totalCost)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Special Requests</p>
                  <p className="font-semibold text-gray-800 truncate">{b.specialRequests || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Advance Paid</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(b.advancePayment ?? 0)}</p>
                </div>
              </div>

              {/* Counter offer input */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Counter offer amount (USD)"
                    value={counterOffer[b.id] ?? ''}
                    onChange={(e) => setCounterOffer((p) => ({ ...p, [b.id]: e.target.value }))}
                  />
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" /> Counter Offer
                </Button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button size="sm" className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700">
                  <CheckCircle className="w-4 h-4" /> Accept Price
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
