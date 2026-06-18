'use client';

import { useDistricts } from '../hooks/useDestination';
import type { District } from '../types/destination.types';
import type { AttractionCategory } from '../types/destination.types';

interface Props {
  selectedId?: string | null;
  onDistrictClick?: (district: District) => void;
  filterCategory?: AttractionCategory;
}

export function SriLankaMap({ selectedId, onDistrictClick }: Props) {
  const { data: districts, isLoading } = useDistricts();

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">Loading map…</div>;
  }

  return (
    <div className="w-full h-full flex flex-col p-4 gap-3">
      <p className="text-xs text-gray-400">Select a district to explore</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-y-auto">
        {districts.map((d) => (
          <button
            key={d.id}
            onClick={() => onDistrictClick?.(d)}
            className={`rounded-lg border px-3 py-2 text-sm text-left transition-all ${
              selectedId === d.id
                ? 'bg-green-600 text-white border-green-600 shadow'
                : d.featured
                ? 'border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <span className="font-medium line-clamp-1">{d.name}</span>
            {d.attractions && (
              <span className="text-xs opacity-70">{d.attractions.length} attractions</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
