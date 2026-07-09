'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Compass } from 'lucide-react';
import { ExperienceCard } from '@/components/public/cards/ExperienceCard';
import { useExperiences } from '@/features/experience';
import type { ExperienceCategory } from '@/features/experience';

const CATEGORIES: { value: ExperienceCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Experiences' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'NATURE', label: 'Nature & Wildlife' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'RELAXATION', label: 'Relaxation & Spa' },
  { value: 'FAMILY', label: 'Family-Friendly' },
  { value: 'ROMANTIC', label: 'Romantic Escapes' },
];

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const { data: experiences, isLoading } = useExperiences({
    category: activeCategory,
    search: search || undefined,
  });

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/15/1f/78/69.jpg"
          alt="Experiences in Sri Lanka"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-sm mb-3">
            Curated Activities
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Where Stories Come Alive
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Crafting Journeys, Forging Memories
          </p>

          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search experiences..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  activeCategory === cat.value
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === 'ALL'
                ? 'All Experiences'
                : CATEGORIES.find((c) => c.value === activeCategory)?.label}
            </h2>
            {!isLoading && (
              <p className="text-gray-500 text-sm">{experiences.length} experience{experiences.length !== 1 ? 's' : ''} found</p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-20">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No experiences found</h3>
              <p className="text-gray-500 mt-2">Try a different category or search term</p>
              <button
                onClick={() => { setActiveCategory('ALL'); setSearch(''); }}
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-green-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Discover More Experiences</h2>
          <p className="text-teal-100 mb-8">
            Can&apos;t find what you&apos;re looking for? Let us craft a custom experience just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tours"
              className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Tours
            </a>
            <a
              href="/contact-us"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Request Custom Experience
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
