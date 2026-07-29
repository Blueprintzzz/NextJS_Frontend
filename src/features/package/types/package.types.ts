export type PackageCategory =
  | 'ADVENTURE'
  | 'NATURE'
  | 'ROMANTIC'
  | 'WILDLIFE'
  | 'FAMILY'
  | 'CULTURAL'
  | 'BEACH'
  | 'LUXURY';

export type PackageStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export interface PackageItinerary {
  day: number;
  title: string;
  description: string;
  attractions: { id: string; label: string; tag: 'destination' }[];
}

export interface PackageInclusion {
  type: 'MEAL' | 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITY';
  description: string;
}

export interface TourPackage {
  id: string;
  name: string;
  description: string;
  category: PackageCategory;
  duration: number;
  basePrice: number;
  highlights: string[];
  bestSeason: string;
  maxCapacity: number;
  images: string[];
  itinerary: PackageItinerary[];
  inclusions: PackageInclusion[];
  status: PackageStatus;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageFilters {
  category?: PackageCategory;
  status?: PackageStatus;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PackagePaginationResponse {
  data: TourPackage[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreatePackageInput {
  name: string;
  description: string;
  category: PackageCategory;
  duration: number;
  basePrice: number;
  highlights: string[];
  bestSeason: string;
  maxCapacity: number;
  images: string[];
  itinerary: PackageItinerary[];
  inclusions: PackageInclusion[];
  status: PackageStatus;
}
