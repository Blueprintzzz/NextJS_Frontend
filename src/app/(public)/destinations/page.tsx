'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, Grid3X3, List, MapPin } from 'lucide-react';
import { DestinationCard } from '@/components/public/cards/DestinationCard';
import { AttractionCard, CategoryFilter, useDestinations } from '@/features/destination';
import type { DestinationCategory } from '@/features/destination';

const LeafletMap = dynamic(
  () => import('@/features/destination/components/LeafletMap').then((m) => ({ default: m.LeafletMap })),
  { ssr: false, loading: () => <div className="h-[1000px] bg-gray-100 animate-pulse rounded-xl" /> }
);

const ATTRACTION_CATEGORIES: { value: DestinationCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'TEMPLE', label: 'Temples' },
  { value: 'BEACH', label: 'Beaches' },
  { value: 'MOUNTAIN', label: 'Mountains' },
  { value: 'WATERFALL', label: 'Waterfalls' },
  { value: 'HISTORIC', label: 'Historic' },
  { value: 'WILDLIFE', label: 'Wildlife' },
];

export default function DestinationsPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [attractionCategory, setAttractionCategory] = useState<DestinationCategory | 'ALL'>('ALL');

  const { data: districts, isLoading: loadingDistricts } = useDestinations(search ? { search } : undefined);
  const { data: attractions, isLoading: loadingAttractions } = useDestinations(
    attractionCategory !== 'ALL' ? { category: attractionCategory } : undefined
  );

  const displayAttractions = attractions.slice(0, 20);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080?random=destinations"
          alt="Destinations in Sri Lanka"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">Explore Sri Lanka</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            An Island Of Wonder
          </h1>
          <p className="text-lg text-white/80 mb-8">Come Explore With Us</p>

          {/* Search bar inside hero */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Find a destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-16 z-20 bg-white border-b border-gray-200 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {loadingDistricts ? 'Loading...' : `${districts.length} destinations`}
            </span>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 bg-white" style={{ isolation: 'isolate' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore on the Map</h2>
          <div className="h-[1000px] rounded-xl overflow-hidden shadow-sm">
            <LeafletMap />
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {search ? `Results for "${search}"` : 'All Destinations'}
          </h2>

          {loadingDistricts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : districts.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No destinations found</h3>
              <p className="text-gray-500 mt-2">Try a different search term</p>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'flex flex-col gap-6'
              }
            >
              {districts.map((district) =>
                viewMode === 'grid' ? (
                  <DestinationCard key={district.id} district={district} />
                ) : (
                  <div
                    key={district.id}
                    className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full sm:w-48 h-40 flex-shrink-0">
                      <Image
                        src={district.coverImage || `https://picsum.photos/400/300?random=${district.id}`}
                        alt={district.name}
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{district.name}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{district.description}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-500">Best: {district.bestVisitingSeason}</span>
                        <a
                          href={`/destinations/${district.id}`}
                          className="text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                          Explore →
                        </a>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Attractions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Top Destinations Across Sri Lanka</h2>
            <p className="text-gray-600">Explore must-see places handpicked by our local experts</p>
          </div>

          {/* Category Filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {ATTRACTION_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setAttractionCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  attractionCategory === cat.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loadingAttractions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : displayAttractions.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No attractions found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayAttractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
