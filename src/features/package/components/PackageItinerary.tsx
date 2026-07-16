'use client';

import { MapPin, Sparkles } from 'lucide-react';
import type { PackageItinerary as IItinerary } from '../types/package.types';

interface Props {
  itinerary: IItinerary[];
}

export function PackageItinerary({ itinerary }: Props) {
  return (
    <div className="space-y-4">
      {itinerary.map((day) => {
        const destinations = day.attractions.filter((a) => a.tag === 'destination');
        const experiences  = day.attractions.filter((a) => a.tag === 'experience');

        return (
          <div key={day.day} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {day.day}
              </div>
              <div className="w-0.5 bg-gray-200 flex-1 mt-2" />
            </div>

            <div className="pb-4 flex-1">
              <h4 className="font-medium text-gray-900">{day.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{day.description}</p>

              {/* Destinations group */}
              {destinations.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2 mb-1">
                    Destinations
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {destinations.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        <MapPin className="w-3 h-3" />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences group */}
              {experiences.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2 mb-1">
                    Experiences
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {experiences.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200"
                      >
                        <Sparkles className="w-3 h-3" />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
