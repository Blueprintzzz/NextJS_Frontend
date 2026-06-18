'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { SriLankaMap, CategoryFilter, WeatherInfo, useDistrictById } from '@/features/destination';
import type { District, AttractionCategory } from '@/features/destination';

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [category, setCategory] = useState<AttractionCategory | undefined>();
  const { data: district } = useDistrictById(selectedId);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Interactive Sri Lanka Map</h1>

      <CategoryFilter selected={category} onChange={setCategory} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-[500px] rounded-xl border border-gray-200 overflow-hidden bg-white">
          <SriLankaMap
            selectedId={selectedId}
            onDistrictClick={(d: District) => setSelectedId(d.id)}
            filterCategory={category}
          />
        </div>

        <div className="lg:w-72 space-y-4">
          {district ? (
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                <div>
                  <h2 className="font-semibold text-gray-900">{district.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-3">{district.description}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Best season:</span> {district.bestVisitingSeason}</p>
                {district.attractions && (
                  <p><span className="font-medium">Attractions:</span> {district.attractions.length}</p>
                )}
              </div>
              <WeatherInfo weather={district.weatherInfo} />
              <Link
                href={`/destinations/${district.id}`}
                className="block w-full text-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center text-sm text-gray-400">
              Click a district to see details
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Legend</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
              Featured districts
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
              Regular districts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
