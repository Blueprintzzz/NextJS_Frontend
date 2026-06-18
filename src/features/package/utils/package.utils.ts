import type { PackageCategory, PackageStatus } from '../types/package.types';

export const CATEGORY_LABELS: Record<PackageCategory, string> = {
  ADVENTURE: 'Adventure',
  NATURE: 'Nature',
  ROMANTIC: 'Romantic',
  WILDLIFE: 'Wildlife',
  FAMILY: 'Family',
  CULTURAL: 'Cultural',
  BEACH: 'Beach',
  LUXURY: 'Luxury',
};

export const CATEGORY_COLORS: Record<PackageCategory, string> = {
  ADVENTURE: 'bg-orange-100 text-orange-800',
  NATURE: 'bg-green-100 text-green-800',
  ROMANTIC: 'bg-pink-100 text-pink-800',
  WILDLIFE: 'bg-yellow-100 text-yellow-800',
  FAMILY: 'bg-blue-100 text-blue-800',
  CULTURAL: 'bg-purple-100 text-purple-800',
  BEACH: 'bg-cyan-100 text-cyan-800',
  LUXURY: 'bg-amber-100 text-amber-800',
};

export const STATUS_COLORS: Record<PackageStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-700',
  DRAFT: 'bg-yellow-100 text-yellow-800',
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const ALL_CATEGORIES: PackageCategory[] = [
  'ADVENTURE', 'NATURE', 'ROMANTIC', 'WILDLIFE', 'FAMILY', 'CULTURAL', 'BEACH', 'LUXURY',
];
