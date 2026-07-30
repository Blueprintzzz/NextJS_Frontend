'use client';

import { HeroSection } from '@/components/public/sections/HeroSection';
import { FeaturedDestinations } from '@/components/public/sections/FeaturedDestinations';
import { WhyChooseUs } from '@/components/public/sections/WhyChooseUs';
import { StatsSection } from '@/components/public/sections/StatsSection';
import { TestimonialCarousel } from '@/components/public/sections/TestimonialCarousel';
import { CTASection } from '@/components/public/sections/CTASection';
import { NewsletterSection } from '@/components/public/sections/NewsletterSection';
import { TrustIndicators } from '@/components/public/sections/TrustIndicators';
import { TourCard } from '@/components/public/cards/TourCard';
import { useFeaturedDestinations } from '@/features/destination';
import { useFeaturedPackages } from '@/features/package';

const heroSlides = [
  {
    image: 'https://thumbs.dreamstime.com/b/sri-dalada-maligawa-temple-sacred-tooth-relic-kandy-lanka-67302862.jpg',
    title: 'Where Dreams Take Flight',
    subtitle: 'Your Home, Your Journey, Your Hospitality Haven',
    ctaText: 'Explore Destinations',
    ctaLink: '/destinations',
    secondaryCtaText: 'Book Now',
    secondaryCtaLink: '/tours',
  },
  {
    image: '/img/Home_1.jpeg',
    title: 'Crafting Journeys, Forging Memories',
    subtitle: 'Discover the breathtaking beauty of Sri Lanka with our expert guides',
    ctaText: 'See Our Tours',
    ctaLink: '/tours',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/about-us',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaczuwgS2A__U7qzOV2KCyx05pbc-5hxJFaKp7FWTh9Sdt5hKVTn6rBgs&s=10',
    title: 'An Island Of Wonder',
    subtitle: 'From misty mountains to golden shores - experience it all',
    ctaText: 'Start Exploring',
    ctaLink: '/experiences',
    secondaryCtaText: 'Contact Us',
    secondaryCtaLink: '/contact-us',
  },
];

function FeaturedToursSection() {
  const { data: tours, isLoading } = useFeaturedPackages();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Crafted Journeys, Forged Memories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featured = (tours ?? []).slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Crafted Journeys, Forged Memories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most popular tour packages, each designed to showcase the best of Sri Lanka
          </p>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((tour) => (
              <TourCard key={tour.id} tour={tour} href={`/tours/${tour.id}`} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No featured tours available yet.
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="/tours"
            className="inline-block px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            See All Tours
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturedDestinationsSection() {
  const { data: districts, isLoading } = useFeaturedDestinations();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Discover Sri Lanka&apos;s Wonders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />)}
          </div>
        </div>
      </section>
    );
  }

  return <FeaturedDestinations destinations={districts.slice(0, 3)} />;
}

export default function HomePage() {
  return (
    <>
      <HeroSection slides={heroSlides} />
      <TrustIndicators />
      <FeaturedDestinationsSection />
      <FeaturedToursSection />
      <WhyChooseUs />
      <StatsSection />
      <TestimonialCarousel />
      <CTASection />
      <NewsletterSection />
    </>
  );
}
