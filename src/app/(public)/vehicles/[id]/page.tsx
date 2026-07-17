'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, CheckCircle2, ArrowLeft, Car } from 'lucide-react';
import { useVehicleById } from '@/features/vehicle';
import { VehicleTypeIcon, VehicleAvailability, VehicleFeatures } from '@/features/vehicle';
import { formatPricePerDay } from '@/features/vehicle';

export default function PublicVehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: vehicle, isLoading } = useVehicleById(id);
  const [imgIdx, setImgIdx] = useState(0);

  if (isLoading) {
    return (
      <main>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <div className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-8 w-1/2 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        </div>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main>
        <section className="py-32 text-center">
          <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-500 mb-8">The vehicle you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
          <Link
            href="/vehicles"
            className="inline-block px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Fleet
          </Link>
        </section>
      </main>
    );
  }

  const images = vehicle.images.length ? vehicle.images : ['/placeholder.svg'];

  return (
    <main>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicles
          </button>
        </div>
      </div>

      {/* Main content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — Image carousel */}
            <div className="space-y-4">
              <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                <Image
                  src={images[imgIdx]}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                        i === imgIdx ? 'border-teal-500' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">
                  <VehicleTypeIcon type={vehicle.type} showLabel />
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{vehicle.name}</h1>
                <div className="flex items-center gap-3 mt-3 text-gray-500">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Users className="w-4 h-4 text-teal-500" />
                    Up to {vehicle.capacity} passengers
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-teal-50 border border-teal-100 rounded-2xl px-6 py-5">
                <p className="text-sm text-teal-600 font-medium mb-0.5">Price per day</p>
                <p className="text-4xl font-bold text-teal-700">{formatPricePerDay(vehicle.pricePerDay)}</p>
                <p className="text-xs text-teal-500 mt-1">Rates may vary for extended bookings</p>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div>
                  <h2 className="font-bold text-gray-900 mb-2">About This Vehicle</h2>
                  <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Features */}
              {vehicle.features.length > 0 && (
                <div>
                  <h2 className="font-bold text-gray-900 mb-3">Features & Amenities</h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/bookings/create"
                  className="flex-1 px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-center"
                >
                  Book This Vehicle
                </Link>
                <Link
                  href="/contact-us"
                  className="flex-1 px-8 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors text-center"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Availability */}
      {vehicle.availability && vehicle.availability.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-teal-600 font-semibold uppercase tracking-widest text-sm mb-2">Schedule</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Availability Calendar</h2>
            </div>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
              <VehicleAvailability availability={vehicle.availability} />
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 bg-teal-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to hit the road?
          </h2>
          <p className="text-teal-100 mb-8">
            Book this vehicle now or explore our other fleet options to find your perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bookings/create"
              className="px-8 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/vehicles"
              className="px-8 py-3 border-2 border-white/60 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-colors"
            >
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
