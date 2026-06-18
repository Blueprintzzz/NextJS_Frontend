'use client';

import { DistrictList } from '@/features/destination';

export default function DestinationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore Sri Lanka</h1>
        <p className="text-sm text-gray-500 mt-1">Discover beautiful districts and attractions across the island</p>
      </div>
      <DistrictList />
    </div>
  );
}
