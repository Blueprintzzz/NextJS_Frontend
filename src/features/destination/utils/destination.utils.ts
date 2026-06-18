import {
  Waves,
  Mountain,
  TreePine,
  Droplets,
  Landmark,
  PawPrint,
  type LucideIcon,
} from 'lucide-react';
import type { Attraction, AttractionCategory, WeatherInfo } from '../types/destination.types';

export function getCategoryColor(category: AttractionCategory): string {
  const map: Record<AttractionCategory, string> = {
    TEMPLE: 'bg-orange-100 text-orange-700',
    BEACH: 'bg-blue-100 text-blue-700',
    MOUNTAIN: 'bg-slate-100 text-slate-700',
    WATERFALL: 'bg-cyan-100 text-cyan-700',
    HISTORIC: 'bg-amber-100 text-amber-700',
    WILDLIFE: 'bg-green-100 text-green-700',
  };
  return map[category] ?? 'bg-gray-100 text-gray-700';
}

export function getCategoryIcon(category: AttractionCategory): LucideIcon {
  const map: Record<AttractionCategory, LucideIcon> = {
    TEMPLE: Landmark,
    BEACH: Waves,
    MOUNTAIN: Mountain,
    WATERFALL: Droplets,
    HISTORIC: Landmark,
    WILDLIFE: PawPrint,
  };
  return map[category] ?? TreePine;
}

export function getAttractionCategoryLabel(category: AttractionCategory): string {
  const map: Record<AttractionCategory, string> = {
    TEMPLE: 'Temple',
    BEACH: 'Beach',
    MOUNTAIN: 'Mountain',
    WATERFALL: 'Waterfall',
    HISTORIC: 'Historic Site',
    WILDLIFE: 'Wildlife',
  };
  return map[category];
}

export function formatEntryFee(fee: number): string {
  if (fee === 0) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(fee);
}

export function formatWeatherInfo(w: WeatherInfo): string {
  return `${w.temperature} · ${w.humidity} humidity · ${w.rainfall} rainfall`;
}

export function getWeatherRating(w: WeatherInfo): number {
  const months = w.bestMonths.length;
  if (months >= 8) return 5;
  if (months >= 6) return 4;
  if (months >= 4) return 3;
  if (months >= 2) return 2;
  return 1;
}

export function groupAttractionsByCategory(
  attractions: Attraction[],
): Record<AttractionCategory, Attraction[]> {
  return attractions.reduce(
    (acc, a) => {
      (acc[a.category] ??= []).push(a);
      return acc;
    },
    {} as Record<AttractionCategory, Attraction[]>,
  );
}

export function filterAttractionsByCategory(
  attractions: Attraction[],
  category: AttractionCategory,
): Attraction[] {
  return attractions.filter((a) => a.category === category);
}

export function sortAttractionsByDistance(
  attractions: Attraction[],
  userLat: number,
  userLng: number,
): Attraction[] {
  return [...attractions].sort((a, b) => {
    const da = Math.hypot(a.latitude - userLat, a.longitude - userLng);
    const db = Math.hypot(b.latitude - userLat, b.longitude - userLng);
    return da - db;
  });
}

export function calculateDistanceFromCurrentLocation(
  lat: number,
  lng: number,
): Promise<number | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = Math.hypot(lat - pos.coords.latitude, lng - pos.coords.longitude) * 111;
        resolve(Math.round(d));
      },
      () => resolve(null),
    );
  });
}
