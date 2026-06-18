'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, DollarSign, MapPin, Lightbulb } from 'lucide-react';
import { getCategoryColor, getAttractionCategoryLabel, formatEntryFee } from '../utils/destination.utils';
import type { Attraction } from '../types/destination.types';

interface Props { attraction: Attraction; }

export function AttractionDetail({ attraction }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = attraction.images.length ? attraction.images : ['/placeholder.svg'];

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="relative h-56 rounded-xl overflow-hidden bg-gray-100">
        <Image src={images[imgIdx]} alt={attraction.name} fill className="object-cover" sizes="100vw" />
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setImgIdx((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"><ChevronRight className="w-4 h-4" /></button>
          </>
        )}
      </div>

      <div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(attraction.category)}`}>
          {getAttractionCategoryLabel(attraction.category)}
        </span>
        <h2 className="text-xl font-bold mt-2">{attraction.name}</h2>
        <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{attraction.estimatedVisitingTime}</span>
        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatEntryFee(attraction.entryFee)}</span>
        {attraction.openingHours && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{attraction.openingHours}</span>}
      </div>

      {attraction.travelTips && (
        <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800 flex gap-2">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{attraction.travelTips}</p>
        </div>
      )}
    </div>
  );
}
