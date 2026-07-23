'use client';

import { Utensils, Car, Bed, Activity, CheckCircle } from 'lucide-react';
import type { PackageInclusion } from '../types/package.types';

const ICONS = {
  MEAL: Utensils,
  TRANSPORT: Car,
  ACCOMMODATION: Bed,
  ACTIVITY: Activity,
};

const LABELS = {
  MEAL: 'Meals',
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Accommodation',
  ACTIVITY: 'Activities',
};

interface Props {
  inclusions: PackageInclusion[];
}

export function PackageInclusions({ inclusions }: Props) {
  const grouped = inclusions.reduce<Record<string, PackageInclusion[]>>((acc, inc) => {
    (acc[inc.type] = acc[inc.type] ?? []).push(inc);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Object.entries(grouped).map(([type, items]) => {
        const Icon = ICONS[type as keyof typeof ICONS];
        return (
          <div key={type} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-900">{LABELS[type as keyof typeof LABELS]}</span>
            </div>
            <ul className="space-y-1">
              {items.map((inc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  {inc.description}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
