'use client';

import { MapPin } from 'lucide-react';
import type { PackageItinerary as IItinerary } from '../types/package.types';

interface Props {
  itinerary: IItinerary[];
}

export function PackageItinerary({ itinerary }: Props) {
  return (
    <div className="space-y-4">
      {itinerary.map((day) => (
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
            {day.attractions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {day.attractions.map((a, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />{a}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
