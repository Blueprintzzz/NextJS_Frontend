'use client';

import { Thermometer, Droplets, CloudRain, CalendarDays } from 'lucide-react';
import type { WeatherInfo as WeatherInfoType } from '../types/destination.types';

interface Props { weather: WeatherInfoType; }

export function WeatherInfo({ weather }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="flex items-center gap-2 text-gray-600">
        <Thermometer className="w-4 h-4 text-red-400" />
        <span>{weather.temperature}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Droplets className="w-4 h-4 text-blue-400" />
        <span>{weather.humidity}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <CloudRain className="w-4 h-4 text-sky-400" />
        <span>{weather.rainfall}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <CalendarDays className="w-4 h-4 text-green-500" />
        <span>{weather.bestMonths.join(', ')}</span>
      </div>
    </div>
  );
}
