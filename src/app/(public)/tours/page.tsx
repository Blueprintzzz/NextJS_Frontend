'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, Package } from 'lucide-react';
import { TourCard } from '@/components/public/cards/TourCard';
import { usePackages } from '@/features/package';
import type { PackageCategory } from '@/features/package';

const CATEGORIES: { value: PackageCategory | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'NATURE', label: 'Nature' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'ROMANTIC', label: 'Romantic' },
  { value: 'WILDLIFE', label: 'Wildlife' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'BEACH', label: 'Beach' },
  { value: 'LUXURY', label: 'Luxury' },
];

const DURATION_OPTIONS = [
  { label: '1–3 Days', min: 1, max: 3 },
  { label: '4–7 Days', min: 4, max: 7 },
  { label: '8–14 Days', min: 8, max: 14 },
  { label: '15+ Days', min: 15, max: 999 },
];

export default function ToursPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | ''>('');
  const [minDuration, setMinDuration] = useState<number | undefined>();
  const [maxDuration, setMaxDuration] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filters = {
    ...(search && { search }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(minDuration !== undefined && { minDuration }),
    ...(maxDuration !== undefined && { maxDuration }),
    ...(minPrice !== undefined && { minPrice }),
    ...(maxPrice !== undefined && { maxPrice }),
  };

  const { data: paginatedTours, isLoading } = usePackages(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  const tours = paginatedTours.data;

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinDuration(undefined);
    setMaxDuration(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  const hasFilters = search || selectedCategory || minDuration || maxDuration || minPrice || maxPrice;

  function handleCustomizeTour() {
    const raw = localStorage.getItem('tfx_auth');
    if (!raw) { router.push('/login?redirect=/tours/customize'); return; }
    const { accessToken } = JSON.parse(raw);
    if (!accessToken) { router.push('/login?redirect=/tours/customize'); return; }
    router.push('/tours/customize');
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080?random=tours"
          alt="Tours in Sri Lanka"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">Tour Packages</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Crafting Your Travel Tale
          </h1>
          <p className="text-lg text-white/80 mb-8">Embark on Tailored Adventures</p>

          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-white/60 text-sm">or</span>
            <button
              onClick={handleCustomizeTour}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-full text-sm font-semibold transition-colors shadow-lg"
            >
              ✨ Customize Your Tour
            </button>
          </div>
        </div>
      </section>

      {/* Layout: Sidebar + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-gray-600 text-sm">
            {isLoading ? 'Loading...' : `${tours.length} tour${tours.length !== 1 ? 's' : ''} found`}
          </p>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center">!</span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`
              w-72 flex-shrink-0 space-y-6
              ${sidebarOpen ? 'block fixed inset-y-0 left-0 z-50 bg-white p-6 overflow-y-auto shadow-2xl w-80' : 'hidden lg:block'}
            `}
          >
            {sidebarOpen && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Filters</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Tour Type */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tour Type</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.value}
                        onChange={() => setSelectedCategory(cat.value)}
                        className="accent-teal-600"
                      />
                      <span className="text-sm text-gray-700">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Duration</h3>
                <div className="space-y-2">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = minDuration === opt.min && maxDuration === opt.max;
                    return (
                      <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setMinDuration(undefined);
                              setMaxDuration(undefined);
                            } else {
                              setMinDuration(opt.min);
                              setMaxDuration(opt.max);
                            }
                          }}
                          className="accent-teal-600"
                        />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range (USD)</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice ?? ''}
                    onChange={(e) => setMinPrice(e.target.value ? +e.target.value : undefined)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                    min={0}
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice ?? ''}
                    onChange={(e) => setMaxPrice(e.target.value ? +e.target.value : undefined)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                    min={0}
                  />
                </div>
              </div>

              {sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium lg:hidden"
                >
                  Apply Filters
                </button>
              )}
            </div>

            {/* Customize CTA card */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold text-base mb-1">Can't find what you need?</h3>
              <p className="text-teal-100 text-xs leading-relaxed mb-4">
                Build a fully customized tour package tailored exactly to your dates, group size, and interests.
              </p>
              <button
                onClick={handleCustomizeTour}
                className="block w-full text-center py-2.5 px-4 bg-white text-teal-700 rounded-xl text-sm font-bold hover:bg-teal-50 transition-colors"
              >
                Build Custom Package →
              </button>
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Tours Grid */}
          <div className="flex-1">
            {/* Customize CTA banner */}
            <div className="flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-2xl px-5 py-4 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-xl flex-shrink-0">
                  ✨
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Want something unique?</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize dates, destinations, group size &amp; activities — we'll build the perfect itinerary for you.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCustomizeTour}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
              >
                ✨ Customize Tour
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm hidden lg:block">
                {isLoading ? 'Loading...' : `${tours.length} tour${tours.length !== 1 ? 's' : ''} found`}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700">
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No tours found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} href={`/tours/${tour.id}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
