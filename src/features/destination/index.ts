export { DistrictList } from './components/DistrictList';
export { DistrictCard } from './components/DistrictCard';
export { DistrictDetail } from './components/DistrictDetail';
export { DistrictSearch } from './components/DistrictSearch';
export { AttractionCard } from './components/AttractionCard';
export { AttractionDetail } from './components/AttractionDetail';
export { AttractionList } from './components/AttractionList';
export { CategoryFilter } from './components/CategoryFilter';
export { WeatherInfo } from './components/WeatherInfo';
export { SriLankaMap } from './components/SriLankaMap';

export {
  useDestinations,
  useDestinationById,
  useFeaturedDestinations,
  useCreateDestination,
  useUpdateDestination,
  useDeleteDestination,
  useMapData,
  useCategories,
  // Legacy aliases
  useDistricts,
  useDistrictById,
  useFeaturedDistricts,
  useAttractions,
  useAttractionsByCategory,
  useAttractionsByDistrict,
} from './hooks/useDestination';

export { DestinationAPI } from './api/destination.api';

export type {
  Destination,
  DestinationCategory,
  DestinationFilters,
  TourCategory,
  TourCategoryName,
  MapData,
  // Legacy aliases
  District,
  Attraction,
  AttractionCategory,
  AttractionFilters,
} from './types/destination.types';
