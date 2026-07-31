'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DriverOffer {
  id: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  driverReviewCount: number;
  vehicleName: string;
  vehicleType: string;
  vehicleCapacity: number;
  offeredPrice: number;
  systemSuggestedPrice: number;
  eta: string;
  driverImage?: string;
  vehicleImage?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < Math.round(value) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{value.toFixed(1)}</span>
    </span>
  );
}

export default function DriverOffersPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  const router = useRouter();
  const qc = useQueryClient();
  const orgId = useAppSelector((s) => s.user.user?.id ?? '');

  const { data: offers = [], isLoading } = useQuery<DriverOffer[]>({
    queryKey: ['driver-offers', bookingId, orgId],
    queryFn: async () => {
      try { return (await apiRequest(`/bookings/${bookingId}/offers`)) as DriverOffer[]; } catch { return []; }
    },
  });

  const selectMutation = useMutation({
    mutationFn: (offerId: string) =>
      apiRequest(`/bookings/${bookingId}/offers/${offerId}/accept`, { method: 'POST' }),
    onSuccess: () => {
      toast.success('Driver selected! Your booking is confirmed.');
      qc.invalidateQueries({ queryKey: ['driver-offers', bookingId] });
      router.push(`/bookings/${bookingId}`);
    },
    onError: () => toast.error('Failed to select driver'),
  });

  const pendingOffers = offers.filter((o) => o.status === 'PENDING');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/bookings/${bookingId}`}><button className="text-sm text-gray-500 hover:text-gray-700">← Back to Booking</button></Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Driver Offers</h1>
          <p className="text-sm text-gray-500">Compare and select your preferred driver</p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {!isLoading && pendingOffers.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <p className="text-4xl mb-3">⏳</p>
          <p className="font-medium text-gray-700">Waiting for driver offers</p>
          <p className="text-sm text-gray-400 mt-1">Your request has been broadcast to available drivers. Check back soon.</p>
        </div>
      )}

      {!isLoading && pendingOffers.length > 0 && (
        <>
          {/* Comparison table */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Driver', 'Price', 'Rating', 'Vehicle', 'ETA', 'Action'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingOffers.map((offer) => (
                    <tr key={offer.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0 overflow-hidden">
                            {offer.driverImage ? <img src={offer.driverImage} alt={offer.driverName} className="w-full h-full object-cover" /> : offer.driverName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{offer.driverName}</p>
                            <p className="text-xs text-gray-400">{offer.driverReviewCount} reviews</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900">${offer.offeredPrice.toLocaleString()}</p>
                        {offer.offeredPrice !== offer.systemSuggestedPrice && (
                          <p className="text-xs text-gray-400">Suggested: ${offer.systemSuggestedPrice.toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-4 py-4"><StarRating value={offer.driverRating} /></td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-800">{offer.vehicleName}</p>
                        <p className="text-xs text-gray-400">{offer.vehicleType} · {offer.vehicleCapacity} seats</p>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{offer.eta}</td>
                      <td className="px-4 py-4">
                        <Button size="sm" onClick={() => selectMutation.mutate(offer.id)} disabled={selectMutation.isPending}>
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">Selecting a driver confirms your booking. You will receive a notification once the driver accepts.</p>
        </>
      )}
    </div>
  );
}
