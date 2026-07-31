'use client';

import dynamic from 'next/dynamic';
import type { MapboxMapProps, MapboxMarker } from './MapboxMap';

const MapboxMap = dynamic(
  () => import('./MapboxMap').then((m) => ({ default: m.MapboxMap })),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-sm text-gray-400"
      >
        Loading map…
      </div>
    ),
  },
);

export { MapboxMap };
export type { MapboxMapProps, MapboxMarker };
