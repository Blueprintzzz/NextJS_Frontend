'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Users, Car } from 'lucide-react';
import { useVehicles } from '@/features/vehicle';
import { VehicleTypeIcon } from '@/features/vehicle';
import { formatPricePerDay } from '@/features/vehicle';
import type { VehicleType } from '@/features/vehicle';

const TYPES: VehicleType[] = ['CAR', 'SUV', 'VAN', 'MINIBUS', 'LUXURY'];

function VehiclesGrid() {
  const [type, setType] = useState<VehicleType | undefined>();
  const { data, isLoading, isFetching, isError } = useVehicles(type ? { type } : undefined);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => setType(undefined)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
              !type
                ? 'bg-teal-600 text-white border-teal-600'
                : 'border-gray-300 text-gray-600 hover:border-teal-400 hover:text-teal-600'
            }`}
          >
            All Vehicles
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t === type ? undefined : t)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-1.5 ${
                type === t
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'border-gray-300 text-gray-600 hover:border-teal-400 hover:text-teal-600'
              }`}
            >
              <VehicleTypeIcon type={t} showLabel />
            </button>
          ))}
        </div>

        {isError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-center">
            Failed to load vehicles. Please try again.
          </p>
        )}

        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No vehicles found.</p>
            <p className="text-sm mt-1">Try a different filter or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  {vehicle.images[0] ? (
                    <Image
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <Car className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-teal-700">
                    {formatPricePerDay(vehicle.pricePerDay)}/day
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-teal-600 transition-colors">
                      {vehicle.name}
                    </h3>
                    <span className="text-gray-400">
                      <VehicleTypeIcon type={vehicle.type} showLabel />
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-teal-500" />
                      {vehicle.capacity} seats
                    </span>
                    {vehicle.features.length > 0 && (
                      <span className="text-gray-300">·</span>
                    )}
                    {vehicle.features.length > 0 && (
                      <span className="truncate text-gray-400 text-xs">
                        {vehicle.features.slice(0, 2).join(' · ')}
                      </span>
                    )}
                  </div>
                  {vehicle.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {vehicle.description}
                    </p>
                  )}
                  <div className="pt-1">
                    <span className="inline-block text-sm font-semibold text-teal-600 group-hover:underline">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function VehiclesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080?random=vehicles"
          alt="Our Fleet"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">
            Our Fleet
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Travel in Comfort & Style
          </h1>
          <p className="text-lg text-white/80">
            Choose from our range of well-maintained vehicles, perfectly suited for every journey across Sri Lanka
          </p>
        </div>
      </section>

      {/* Intro strip */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">
              Explore Our Fleet
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Right Vehicle for Every Journey
            </h2>
            <p className="text-gray-600 leading-relaxed">
              From compact cars for solo adventures to spacious minibuses for group tours, our fleet is maintained to the highest standards so you can travel with confidence.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Vehicle Types', value: '5+' },
              { label: 'Seats Available', value: 'Up to 20' },
              { label: 'Daily Rentals', value: '100+' },
              { label: 'Happy Travellers', value: '10K+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-white rounded-2xl shadow-sm"
              >
                <p className="text-3xl font-bold text-teal-600 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle grid with filters */}
      <VehiclesGrid />

      {/* CTA */}
      <section className="py-20 bg-teal-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need help choosing the right vehicle?
          </h2>
          <p className="text-teal-100 mb-8 text-lg">
            Our team is happy to recommend the best option for your group size, itinerary and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="px-8 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              href="/tours"
              className="px-8 py-3 border-2 border-white/60 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-colors"
            >
              Browse Tour Packages
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
