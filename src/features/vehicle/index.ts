export { VehicleList } from './components/VehicleList';
export { VehicleCard } from './components/VehicleCard';
export { VehicleDetail } from './components/VehicleDetail';
export { VehicleSelector } from './components/VehicleSelector';
export { VehicleAvailability } from './components/VehicleAvailability';
export { VehicleTypeIcon } from './components/VehicleTypeIcon';
export { VehicleFeatures } from './components/VehicleFeatures';
export { CreateVehicleForm } from './components/CreateVehicleForm';
export { EditVehicleForm } from './components/EditVehicleForm';
export { VehicleRecommendation } from './components/VehicleRecommendation';

export {
  useDriverVehicles,
  useVehicles,
  useVehicleById,
  useCheckAvailability,
  useRecommendedVehicle,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from './hooks/useVehicles';

export { VehicleAPI } from './api/vehicle.api';

export {
  getVehicleTypeLabel,
  getVehicleTypeIcon,
  formatPricePerDay,
  calculateTotalVehicleCost,
  filterAvailableVehicles,
  sortVehiclesByPrice,
  matchVehicleCapacity,
} from './utils/vehicle.utils';

export type {
  Vehicle,
  VehicleEntity,
  VehicleType,
  VehicleStatus,
  VehicleFilters,
  VehicleAvailability as VehicleAvailabilityType,
  CheckAvailabilityInput,
  AvailabilityResult,
  CreateVehicleInput,
} from './types/vehicle.types';
