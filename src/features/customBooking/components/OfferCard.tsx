'use client';

import type { DriverOffer } from '../types/customBooking.types';

export function OfferCard({
  offer,
  isSelected,
  onAccept,
  onReject,
  canAct,
}: {
  offer: DriverOffer;
  isSelected?: boolean;
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
  canAct?: boolean;
}) {
  const isExpired = new Date(offer.validUntil) < new Date();

  return (
    <div
      className={[
        'rounded-2xl border-2 p-5 transition-all',
        isSelected
          ? 'border-teal-500 bg-teal-50'
          : offer.status === 'REJECTED'
          ? 'border-gray-100 bg-gray-50 opacity-60'
          : 'border-gray-200 bg-white',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {offer.driver?.firstName} {offer.driver?.lastName}
          </p>
          {offer.driver?.driverProfile && (
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
              {offer.driver.driverProfile.rating && (
                <span>⭐ {Number(offer.driver.driverProfile.rating).toFixed(1)}</span>
              )}
              <span>{offer.driver.driverProfile.totalTrips} trips</span>
              {offer.driver.driverProfile.isVerified && (
                <span className="text-teal-600 font-medium">✓ Verified</span>
              )}
            </div>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-teal-700">
            ${Number(offer.price).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">total offer</p>
        </div>
      </div>

      {offer.vehicle && (
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <span>🚗 {offer.vehicle.vehicleModel?.name ?? offer.vehicle.type}</span>
          <span>·</span>
          <span>👥 {offer.vehicle.capacity} seats</span>
        </div>
      )}

      {offer.message && (
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{offer.message}</p>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-400">
          {offer.eta && <span>ETA: {offer.eta} · </span>}
          Valid until {new Date(offer.validUntil).toLocaleDateString()}
          {isExpired && <span className="text-red-400 ml-1">(Expired)</span>}
        </div>

        {canAct && offer.status === 'PENDING' && !isExpired && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject?.(offer.id)}
              className="px-3 py-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => onAccept?.(offer.id)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Accept
            </button>
          </div>
        )}

        {isSelected && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">
            ✓ Accepted
          </span>
        )}

        {offer.status === 'REJECTED' && (
          <span className="text-xs text-gray-400 font-medium">Declined</span>
        )}
      </div>
    </div>
  );
}
