'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Star, MapPin, Users,
  Car, CheckCircle2, Package, ArrowLeft,
} from 'lucide-react';
import { useVehicleById } from '@/features/vehicle';
import { VehicleTypeIcon, formatPricePerDay } from '@/features/vehicle';
import { usePackages } from '@/features/package';
import { TourCard } from '@/components/public/cards/TourCard';
import { useReviews } from '@/features/review';
import { ReviewCard } from '@/features/review';

export default function DriverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: vehicle, isLoading } = useVehicleById(id);
  const { data: packagesPage } = usePackages();
  const { data: reviewsPage } = useReviews({ limit: 6 });
  const [imgIdx, setImgIdx] = useState(0);

  const packages = packagesPage.data.slice(0, 3);
  const reviews = reviewsPage.data.slice(0, 4);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
        <div className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-32 rounded bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Driver Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn&apos;t find the driver you&apos;re looking for.</p>
        <Link href="/drivers" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Back to Drivers
        </Link>
      </div>
    );
  }

  const images = vehicle.images.length ? vehicle.images : [`https://picsum.photos/800/500?random=${vehicle.id}`];

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/drivers"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Drivers
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-10">
          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-3xl flex-shrink-0">
            {vehicle.name?.charAt(0) ?? '?'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{vehicle.name}</h1>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> Sri Lanka
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.0 · 12 reviews</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                Verified Driver
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                Active
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1">
                <VehicleTypeIcon type={vehicle.type} showLabel />
              </span>
            </div>
          </div>
          <Link
            href="/bookings/create"
            className="flex-shrink-0 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors text-sm"
          >
            Book This Driver
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Vehicle Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-teal-600" /> Vehicle
              </h2>

              {/* Image carousel */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-100 shadow-sm mb-4">
                <Image
                  src={images[imgIdx]}
                  alt={vehicle.name ?? 'Vehicle'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4 text-teal-500" />
                  <span>Capacity: {vehicle.capacity} passengers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Car className="w-4 h-4 text-teal-500" />
                  <span>Type: <VehicleTypeIcon type={vehicle.type} showLabel /></span>
                </div>
                {vehicle.description && (
                  <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                )}
                {vehicle.features.length > 0 && (
                  <ul className="grid grid-cols-2 gap-1.5 pt-2">
                    {vehicle.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Published Packages */}
            {packages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-600" /> Published Packages
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {packages.map((pkg) => (
                    <TourCard key={pkg.id} tour={pkg} href={`/tours/${pkg.id}`} />
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-teal-600" /> Reviews
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                <Link
                  href="/customer-reviews"
                  className="inline-block mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  View all reviews →
                </Link>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Price per day</p>
                  <p className="text-3xl font-bold text-teal-600">{formatPricePerDay(vehicle.pricePerDay)}</p>
                </div>
                <Link
                  href="/bookings/create"
                  className="block w-full text-center py-3 px-6 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors text-sm"
                >
                  Book Now
                </Link>
                <Link
                  href="/contact-us"
                  className="block w-full text-center py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Send Enquiry
                </Link>
              </div>

              <div className="bg-teal-50 rounded-2xl p-4 text-sm space-y-1">
                <h3 className="font-semibold text-teal-800">Driver Stats</h3>
                <p className="text-teal-700">⭐ 4.0 average rating</p>
                <p className="text-teal-700">🚗 12 completed tours</p>
                <p className="text-teal-700">✅ Verified & insured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
