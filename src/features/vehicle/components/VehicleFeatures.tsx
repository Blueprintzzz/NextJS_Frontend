'use client';

import { CheckCircle2 } from 'lucide-react';

interface Props {
  features: string[];
}

export function VehicleFeatures({ features }: Props) {
  if (!features.length) return null;
  return (
    <ul className="grid grid-cols-2 gap-1">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-1.5 text-sm text-gray-600">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
  );
}
