'use client';

import { useState } from 'react';
import { useDistricts } from '../hooks/useDestination';
import { DistrictCard } from './DistrictCard';
import { DistrictSearch } from './DistrictSearch';

export function DistrictList() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useDistricts(search || undefined);

  return (
    <div className="space-y-4">
      <DistrictSearch value={search} onChange={setSearch} />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-60 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-sm">No destinations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((d) => <DistrictCard key={d.id} district={d} />)}
        </div>
      )}
    </div>
  );
}
