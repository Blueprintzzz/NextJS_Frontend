'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Clock, Users, Star, Sun,
  CheckCircle, XCircle, MapPin, Calendar
} from 'lucide-react';
import { usePackageById, useFeaturedPackages } from '@/features/package';
import { PackageItinerary, PackageInclusions } from '@/features/package';
import { TourCard } from '@/components/public/cards/TourCard';
import { formatPrice, CATEGORY_LABELS, CATEGORY_COLORS } from '@/features/package';

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pkg, isLoading, isError } = usePackageById(id);
  const { data: featured } = useFeaturedPackages();
  const [imgIdx, setImgIdx] = useState(0);
  const [guests, setGuests] = useState(2);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-4">
        <div className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-8 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-32 rounded bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Tour Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn&apos;t find the tour you&apos;re looking for.</p>
        <Link href="/tours" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Back to Tours
        </Link>
      </div>
    );
  }

  const images = pkg.images?.length ? pkg.images : [`https://picsum.photos/1200/600?random=${pkg.id}`];
  const related = featured.filter((t) => t.id !== pkg.id && t.category === pkg.category).slice(0, 3);
  const totalPrice = pkg.basePrice * guests;

  const notIncluded = ['Flights & Visa fees', 'Travel insurance', 'Personal expenses', 'Tips & gratuities'];

  return (
    <main className="pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/tours" className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
            <ChevronLeft className="w-4 h-4" />
            All Tours
          </Link>
        </nav>

        {/* Image Carousel */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <Image
            src={images[imgIdx]}
            alt={pkg.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white shadow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white shadow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-12 h-9 rounded overflow-hidden border-2 ${i === imgIdx ? 'border-teal-400' : 'border-white/50'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[pkg.category]}`}>
                {CATEGORY_LABELS[pkg.category]}
              </span>
              {pkg.rating != null && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {pkg.rating.toFixed(1)}
                  {pkg.reviewCount && <span className="text-gray-400">({pkg.reviewCount} reviews)</span>}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{pkg.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-teal-600">{formatPrice(pkg.basePrice)}</p>
            <p className="text-xs text-gray-400">per person</p>
          </div>
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Tour Overview</h2>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </section>

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Highlights</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Day-by-Day Itinerary</h2>
                <PackageItinerary itinerary={pkg.itinerary} />
              </section>
            )}

            {/* Inclusions */}
            {pkg.inclusions?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
                <PackageInclusions inclusions={pkg.inclusions} />
              </section>
            )}

            {/* Not Included */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Not Included</h2>
              <ul className="space-y-2">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Best Time */}
            <section className="bg-teal-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-teal-800 mb-2 flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Best Time to Visit
              </h2>
              <p className="text-teal-700">{pkg.bestSeason}</p>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Quick Info */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                <h3 className="font-bold text-gray-900">Quick Info</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-teal-500" />
                  <span>Duration: {pkg.duration} Days</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-teal-500" />
                  <span>Max Group: {pkg.maxCapacity} people</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Sun className="w-4 h-4 text-teal-500" />
                  <span>Best Season: {pkg.bestSeason}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>Category: {CATEGORY_LABELS[pkg.category]}</span>
                </div>
              </div>

              {/* Booking Panel */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(pkg.basePrice)}</span>
                  <span className="text-gray-500 text-sm">/ person</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Number of Guests</label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="font-semibold text-gray-900 w-6 text-center">{guests}</span>
                    <button
                      onClick={() => setGuests((g) => Math.min(pkg.maxCapacity, g + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
                  <span>{formatPrice(pkg.basePrice)} × {guests} guests</span>
                  <span className="font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                </div>

                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(`/bookings/create?packageId=${pkg.id}&guests=${guests}`)}`}
                  className="block w-full text-center py-3 px-6 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Book Now
                </Link>
                <Link
                  href="/contact-us"
                  className="block w-full text-center py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Request Custom Tour
                </Link>
              </div>

              {/* Support */}
              <div className="bg-teal-50 rounded-2xl p-4 text-sm space-y-2">
                <h3 className="font-semibold text-teal-800">Need Help?</h3>
                <p className="text-teal-700">Our team is available 24/7 to assist you.</p>
                <a href="tel:+94771234567" className="flex items-center gap-1 text-teal-600 font-medium hover:text-teal-700">
                  <Calendar className="w-4 h-4" />
                  +94 77 123 4567
                </a>
                <a href="/contact-us" className="text-teal-600 font-medium hover:text-teal-700 block">
                  Chat with us →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Tours You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((tour) => (
                <TourCard key={tour.id} tour={tour} href={`/tours/${tour.id}`} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
