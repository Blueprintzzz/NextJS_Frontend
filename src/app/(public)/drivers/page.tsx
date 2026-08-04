'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, MapPin, Car, Users } from 'lucide-react';
import { useVehicles } from '@/features/vehicle';
import type { VehicleType } from '@/features/vehicle';

const VEHICLE_TYPES: { value: VehicleType | ''; label: string }[] = [
  { value: '', label: 'All Vehicles' },
  { value: 'CAR', label: 'Car' },
  { value: 'SUV', label: 'SUV' },
  { value: 'VAN', label: 'Van' },
  { value: 'MINIBUS', label: 'Mini Bus' },
  { value: 'LUXURY', label: 'Luxury' },
];

// Derive driver cards from vehicles — each unique vehicle represents a driver listing
export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');

  const { data: vehicles, isLoading } = useVehicles(vehicleType ? { type: vehicleType } : undefined);

  const filtered = vehicles.filter((v) =>
    !search || (v.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080?random=drivers"
          alt="Our Drivers"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">
            Trusted Drivers
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Meet Your Expert Guides
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Experienced, verified drivers ready to take you across Sri Lanka
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search drivers or vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {VEHICLE_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setVehicleType(t.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  vehicleType === t.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {!isLoading && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {filtered.length} driver{filtered.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
      </section>

      {/* Driver Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No drivers found</h3>
              <p className="text-gray-500 mt-2">Try a different filter or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/drivers/${vehicle.id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
                >
                  {/* Vehicle image as driver card hero */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {vehicle.images[0] ? (
                      <Image
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <Car className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {vehicle.type}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Driver avatar + name row */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
                        {vehicle.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                          {vehicle.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Sri Lanka
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">4.0 (12 reviews)</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-teal-500" />
                        {vehicle.capacity} seats
                      </span>
                      <span className="font-semibold text-teal-600 group-hover:underline">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
