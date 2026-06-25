export type AttractionCategory = 'TEMPLE' | 'BEACH' | 'MOUNTAIN' | 'WATERFALL' | 'HISTORIC' | 'WILDLIFE';
export type TourCategoryName = 'ADVENTURE' | 'NATURE' | 'ROMANTIC' | 'WILDLIFE' | 'FAMILY' | 'CULTURAL' | 'BEACH' | 'LUXURY';

export interface WeatherInfo {
  temperature?: string;
  humidity?: string;
  rainfall?: string;
  condition?: string;
  bestMonths?: string[];
}

export interface Attraction {
  id: string;
  districtId: string;
  name: string;
  description: string;
  category: AttractionCategory;
  images: string[];
  travelTips: string;
  estimatedVisitingTime: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
  entryFee: number;
  district?: { name: string };
}

export interface MapDistrict {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  featured?: boolean;
}

export interface MapData {
  districts: MapDistrict[];
  attractions: Attraction[];
}

export interface District {
  id: string;
  name: string;
  description: string;
  weatherInfo: WeatherInfo;
  bestVisitingSeason: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  featured: boolean;
  attractions?: Attraction[];
}

export interface TourCategory {
  id: string;
  name: TourCategoryName;
  description: string;
  icon: string;
  color: string;
  featured: boolean;
}

export interface AttractionFilters {
  districtId?: string;
  category?: AttractionCategory;
  search?: string;
  page?: number;
}
