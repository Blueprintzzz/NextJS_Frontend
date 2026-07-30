'use client';

import Link from 'next/link';
import { DistrictCard as DestinationCardFeature } from '@/features/destination';
import type { Destination } from '@/features/destination';

interface FeaturedDestinationsProps {
  destinations: Destination[];
  title?: string;
  showCta?: boolean;
}

export function FeaturedDestinations({
  destinations,
  title = 'Discover Sri Lanka\'s Wonders',
  showCta = true,
}: FeaturedDestinationsProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the diverse landscapes and cultural treasures of our island home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCardFeature key={destination.id} district={destination} />
          ))}
        </div>

        {showCta && (
          <div className="text-center mt-12">
            <Link
              href="/destinations"
              className="inline-block px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Explore All Destinations
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}