export type DestinationCategory =
  | 'TEMPLE'
  | 'BEACH'
  | 'MOUNTAIN'
  | 'WATERFALL'
  | 'HISTORIC'
  | 'WILDLIFE'
  | 'CITY'
  | 'NATURE';

export type TourCategoryName = 'ADVENTURE' | 'NATURE' | 'ROMANTIC' | 'WILDLIFE' | 'FAMILY' | 'CULTURAL' | 'BEACH' | 'LUXURY';

export interface Destination {
  id: string;
  name: string;
  description: string;
  category: DestinationCategory;
  images: string[];
  coverImage?: string;
  latitude: number;
  longitude: number;
  weatherInfo?: {
    temperature?: string;
    humidity?: string;
    rainfall?: string;
    condition?: string;
    climate?: string;
    bestMonths?: string[];
  };
  bestVisitingSeason?: string;
  travelTips?: string;
  estimatedVisitingTime?: string;
  openingHours?: string;
  entryFee?: number;
  featured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MapData {
  destinations: Destination[];
}

export interface TourCategory {
  id: string;
  name: TourCategoryName;
  description: string;
  icon: string;
  color: string;
  featured: boolean;
}

export interface DestinationFilters {
  category?: DestinationCategory;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

// Legacy aliases kept for any remaining internal references
export type District = Destination;
export type Attraction = Destination;
export type AttractionCategory = DestinationCategory;
export type AttractionFilters = DestinationFilters;
