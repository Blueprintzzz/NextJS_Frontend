'use client';

import Image from 'next/image';

interface TrustIndicator {
  name: string;
  logo: string;
}

const indicators: TrustIndicator[] = [
  { name: 'TripAdvisor', logo: 'https://picsum.photos/200/100?random=tripadvisor' },
  { name: 'Booking.com', logo: 'https://picsum.photos/200/100?random=booking' },
  { name: 'Expedia', logo: 'https://picsum.photos/200/100?random=expedia' },
  { name: 'Skyscanner', logo: 'https://picsum.photos/200/100?random=skyscanner' },
];

export function TrustIndicators() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            Trusted by Leading Travel Platforms
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-70">
          {indicators.map((indicator) => (
            <div key={indicator.name} className="flex justify-center">
              <div className="relative w-32 h-16">
                <Image
                  src={indicator.logo}
                  alt={indicator.name}
                  fill
                  className="object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}