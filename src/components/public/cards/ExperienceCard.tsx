'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Star, DollarSign } from 'lucide-react';
import type { Experience, ExperienceCategory } from '@/features/experience';

const CATEGORY_LABELS: Record<ExperienceCategory, string> = {
  ADVENTURE: 'Adventure',
  NATURE: 'Nature & Wildlife',
  CULTURAL: 'Cultural',
  RELAXATION: 'Relaxation & Spa',
  FAMILY: 'Family-Friendly',
  ROMANTIC: 'Romantic Escapes',
};

const CATEGORY_COLORS: Record<ExperienceCategory, string> = {
  ADVENTURE: 'bg-orange-100 text-orange-700',
  NATURE: 'bg-green-100 text-green-700',
  CULTURAL: 'bg-purple-100 text-purple-700',
  RELAXATION: 'bg-teal-100 text-teal-700',
  FAMILY: 'bg-yellow-100 text-yellow-700',
  ROMANTIC: 'bg-pink-100 text-pink-700',
};

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={experience.image || `https://picsum.photos/600/400?random=${experience.id}`}
          alt={experience.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[experience.category]}`}
        >
          {CATEGORY_LABELS[experience.category]}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{experience.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{experience.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              {experience.duration}
            </span>
            {experience.rating != null && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {Number(experience.rating).toFixed(1)}
                {experience.reviewCount != null && (
                  <span className="text-gray-400 text-xs">({experience.reviewCount})</span>
                )}
              </span>
            )}
          </div>
          <span className="flex items-center gap-0.5 font-semibold text-teal-600">
            <DollarSign className="w-3.5 h-3.5" />
            {Number(experience.price).toLocaleString()}
          </span>
        </div>

        <Link
          href={`/experiences/${experience.id}`}
          className="inline-block w-full text-center py-2 px-4 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
