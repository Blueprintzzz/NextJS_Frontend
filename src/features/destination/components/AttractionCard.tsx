'use client';

import Image from 'next/image';
import { Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryColor, getAttractionCategoryLabel, formatEntryFee } from '../utils/destination.utils';
import type { Attraction } from '../types/destination.types';

interface Props {
  attraction: Attraction;
  onClick?: () => void;
}

export function AttractionCard({ attraction, onClick }: Props) {
  return (
    <Card
      className={`overflow-hidden hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="relative h-40 bg-gray-100">
        {attraction.images[0] ? (
          <Image src={attraction.images[0]} alt={attraction.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
        <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full ${getCategoryColor(attraction.category)}`}>
          {getAttractionCategoryLabel(attraction.category)}
        </span>
      </div>
      <CardContent className="p-3 space-y-1">
        <h3 className="font-medium text-gray-900 line-clamp-1">{attraction.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{attraction.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{attraction.estimatedVisitingTime}</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatEntryFee(attraction.entryFee)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
