'use client';

import { useMemo } from 'react';
import type { VehicleAvailability as AvailabilityEntry } from '../types/vehicle.types';

interface Props {
  availability: AvailabilityEntry[];
}

export function VehicleAvailability({ availability }: Props) {
  const byDate = useMemo(() => {
    const map: Record<string, boolean> = {};
    availability.forEach((a) => { map[a.date.slice(0, 10)] = a.isAvailable; });
    return map;
  }, [availability]);

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  }, []);

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Availability – Next 30 Days</h4>
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const avail = byDate[date];
          const label = new Date(date).getDate();
          let bg = 'bg-gray-100 text-gray-400';
          if (avail === true) bg = 'bg-green-100 text-green-700';
          if (avail === false) bg = 'bg-red-100 text-red-400 line-through';
          return (
            <div key={date} className={`rounded text-xs text-center py-1 ${bg}`} title={date}>
              {label}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> Available</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Unavailable</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Unknown</span>
      </div>
    </div>
  );
}
