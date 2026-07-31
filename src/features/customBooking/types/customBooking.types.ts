export type CustomBookingStatus =
  | 'PENDING'
  | 'OFFER_RECEIVED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export type VehicleType = 'CAR' | 'SUV' | 'VAN' | 'MINIBUS' | 'LUXURY';

export interface DriverOffer {
  id: string;
  customBookingId: string;
  driverId: string;
  vehicleId: string;
  price: number;
  message?: string;
  eta?: string;
  status: OfferStatus;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    driverProfile?: {
      rating?: number;
      totalTrips: number;
      isVerified: boolean;
    };
  };
  vehicle?: {
    id: string;
    type: VehicleType;
    capacity: number;
    pricePerDay: number;
    images: string[];
    vehicleModel?: { name: string };
  };
}

export interface CustomBooking {
  id: string;
  bookingNumber: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget?: number;
  pickupLocation: string;
  dropoffLocation: string;
  requestedVehicleType: VehicleType;
  requestedModelId?: string;
  destinations: string[];
  requirements?: string;
  status: CustomBookingStatus;
  selectedOfferId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  requestedModel?: {
    id: string;
    name: string;
    type: string;
  };
  offers?: DriverOffer[];
  _count?: { offers: number };
}

export interface CreateCustomBookingInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget?: number | null;
  pickupLocation: string;
  dropoffLocation: string;
  requestedVehicleType: VehicleType;
  requestedModelId?: string;
  destinations: string[];
  requirements?: string;
}

export interface CustomBookingQueryParams {
  status?: CustomBookingStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CustomBookingPaginationResponse {
  data: CustomBooking[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
