'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, Clock, Star, DollarSign, CheckCircle,
  Users, Calendar, Info
} from 'lucide-react';
import { useExperienceById, useFeaturedExperiences } from '@/features/experience';
import { ExperienceCard } from '@/components/public/cards/ExperienceCard';

const CATEGORY_LABELS: Record<string, string> = {
  ADVENTURE: 'Adventure',
  NATURE: 'Nature & Wildlife',
  CULTURAL: 'Cultural',
  RELAXATION: 'Relaxation & Spa',
  FAMILY: 'Family-Friendly',
  ROMANTIC: 'Romantic Escapes',
};

const WHAT_INCLUDED: Record<string, string[]> = {
  ADVENTURE: ['Professional guide', 'Safety equipment', 'Insurance coverage', 'Light refreshments'],
  NATURE: ['Expert naturalist guide', 'Binoculars', 'Field guide book', 'Transport to site'],
  CULTURAL: ['Local instructor', 'Materials & props', 'Certificate of participation', 'Tea & snacks'],
  RELAXATION: ['Full therapy session', 'Herbal products', 'Steam room access', 'Herbal tea'],
  FAMILY: ['Child-friendly guide', 'Activity kit', 'Snack pack', 'Group photo'],
  ROMANTIC: ['Private setup', 'Champagne/mocktails', 'Snack platter', 'Photographer (on request)'],
};

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: experience, isLoading, isError } = useExperienceById(id);
  const { data: featured } = useFeaturedExperiences();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
        <div className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-8 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-32 rounded bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (isError || !experience) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Experience Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn&apos;t find the experience you&apos;re looking for.</p>
        <Link href="/experiences" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Back to Experiences
        </Link>
      </div>
    );
  }

  const included = WHAT_INCLUDED[experience.category] ?? ['Guide', 'Equipment', 'Refreshments'];
  const related = featured.filter((e) => e.id !== experience.id && e.category === experience.category).slice(0, 3);

  return (
    <main className="pb-16">
      {/* Hero Image */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <Image
          src={experience.image || `https://picsum.photos/1920/800?random=${experience.id}`}
          alt={experience.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-5xl mx-auto">
          <span className="inline-block px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full mb-3">
            {CATEGORY_LABELS[experience.category] ?? experience.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {experience.name}
          </h1>
          {experience.rating != null && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(Number(experience.rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                ))}
              </div>
              <span className="text-white text-sm">{Number(experience.rating).toFixed(1)}</span>
              {experience.reviewCount != null && (
                <span className="text-white/70 text-sm">({experience.reviewCount} reviews)</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            All Experiences
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About This Experience</h2>
              <p className="text-gray-600 leading-relaxed text-base">{experience.description}</p>
              <p className="text-gray-600 leading-relaxed text-base mt-3">
                Immerse yourself in an authentic Sri Lankan experience with our expert local guides. This carefully curated activity offers an unforgettable glimpse into the island&apos;s natural beauty and cultural richness.
              </p>
            </div>

            {/* What's Included */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Good to Know</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <Info className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>Comfortable footwear recommended. Suitable for most fitness levels.</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>Groups of up to 12 people. Private bookings available.</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>Available year-round. Best experienced between December and April.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                  <span className="text-3xl font-bold text-gray-900">${experience.price}</span>
                  <span className="text-gray-500 text-sm">per person</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span>Duration: {experience.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-500" />
                    <span>Group size: Up to 12</span>
                  </div>
                </div>

                <Link
                  href="/contact-us"
                  className="block w-full text-center py-3 px-6 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors text-sm"
                >
                  Contact Us
                </Link>
                <Link
                  href="/contact-us"
                  className="block w-full text-center py-3 px-6 border border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors text-sm"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Experiences */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
