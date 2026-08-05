import type {
  TourPackage,
  PackageFilters,
  PackagePaginationResponse,
  CreatePackageInput,
} from '../types/package.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const EMPTY_PAGE: PackagePaginationResponse = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem('tfx_auth');
  if (!raw) return {};
  try {
    const { accessToken } = JSON.parse(raw) as { accessToken?: string };
    if (!accessToken) return {};
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  } catch {
    return {};
  }
}

// Backend returns itineraries[] and inclusions[].inclusion — map to frontend shape
function mapPackage(data: Record<string, unknown>): TourPackage {
  type RawInclusion = { type: string; inclusion?: string; description?: string };
  type RawPkg = TourPackage & {
    itineraries?: { day: number; title: string; description: string; destinations?: string; airportPickup?: boolean; airportDropoff?: boolean }[];
    inclusions?: RawInclusion[];
  };
  const pkg = { ...data } as unknown as RawPkg;

  if (pkg.itineraries) {
    pkg.itinerary = pkg.itineraries.map((item) => ({
      day: item.day,
      title: item.title,
      description: item.description,
      airportPickup:  item.airportPickup  ?? false,
      airportDropoff: item.airportDropoff ?? false,
      attractions: item.destinations
        ? item.destinations.split(', ').filter(Boolean).map((label, i) => ({
            id: String(i),
            label,
            tag: 'destination' as const,
          }))
        : [],
    }));
  }

  if (pkg.inclusions) {
    const rawInclusions: RawInclusion[] = pkg.inclusions as unknown as RawInclusion[];
    pkg.inclusions = rawInclusions.map((inc) => ({
      type: inc.type as TourPackage['inclusions'][number]['type'],
      description: inc.inclusion ?? inc.description ?? '',
    }));
  }

  return pkg as TourPackage;
}

export const PackageAPI = {
  async getAll(filters?: PackageFilters): Promise<PackagePaginationResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.category)    params.set('category',    filters.category);
      if (filters?.minPrice)    params.set('minPrice',    String(filters.minPrice));
      if (filters?.maxPrice)    params.set('maxPrice',    String(filters.maxPrice));
      if (filters?.minDuration) params.set('minDuration', String(filters.minDuration));
      if (filters?.maxDuration) params.set('maxDuration', String(filters.maxDuration));
      if (filters?.search)      params.set('search',      filters.search);
      if (filters?.page)        params.set('page',        String(filters.page));
      if (filters?.limit)       params.set('limit',       String(filters.limit));
      const qs = params.toString();
      const res = await fetch(`${API_URL}/packages${qs ? `?${qs}` : ''}`);
      if (!res.ok) return EMPTY_PAGE;
      const raw = await res.json() as { data?: unknown[] } & Omit<PackagePaginationResponse, 'data'>;
      if (!raw?.data) return EMPTY_PAGE;
      return {
        ...raw,
        data: raw.data.map((p) => mapPackage(p as Record<string, unknown>)),
      };
    } catch {
      return EMPTY_PAGE;
    }
  },

  // Legacy alias used by existing hooks
  async getPackages(filters?: PackageFilters): Promise<PackagePaginationResponse> {
    return PackageAPI.getAll(filters);
  },

  async getFeatured(): Promise<TourPackage[]> {
    try {
      const res = await fetch(`${API_URL}/packages/featured`);
      if (!res.ok) return [];
      const raw = await res.json() as unknown[];
      return Array.isArray(raw)
        ? raw.map((p) => mapPackage(p as Record<string, unknown>))
        : [];
    } catch {
      return [];
    }
  },

  // Legacy alias
  async getFeaturedPackages(): Promise<TourPackage[]> {
    return PackageAPI.getFeatured();
  },

  async getById(id: string): Promise<TourPackage | null> {
    try {
      const res = await fetch(`${API_URL}/packages/${id}`);
      if (!res.ok) return null;
      return mapPackage(await res.json() as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  // Legacy alias
  async getPackageById(id: string): Promise<TourPackage | null> {
    return PackageAPI.getById(id);
  },

  async getByCategory(
    category: string,
    page = 1,
    limit = 10,
  ): Promise<PackagePaginationResponse> {
    try {
      const res = await fetch(
        `${API_URL}/packages/category/${category}?page=${page}&limit=${limit}`,
      );
      if (!res.ok) return EMPTY_PAGE;
      const raw = await res.json() as { data?: unknown[] } & Omit<PackagePaginationResponse, 'data'>;
      if (!raw?.data) return EMPTY_PAGE;
      return {
        ...raw,
        data: raw.data.map((p) => mapPackage(p as Record<string, unknown>)),
      };
    } catch {
      return EMPTY_PAGE;
    }
  },

  // Legacy alias
  async getPackagesByCategory(category: string): Promise<TourPackage[]> {
    const result = await PackageAPI.getByCategory(category);
    return result.data;
  },

  async create(input: CreatePackageInput): Promise<TourPackage> {
    const body: Record<string, unknown> = {
      name:        input.name,
      description: input.description,
      category:    input.category,
      duration:    input.duration,
      basePrice:   input.basePrice,
      highlights:  input.highlights,
      bestSeason:  input.bestSeason,
      maxCapacity: input.maxCapacity,
      images:      input.images,
      status:      input.status,
      featured:    input.featured ?? false,
    };
    if (input.destinationId) body.destinationId = input.destinationId;

    const res = await fetch(`${API_URL}/packages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(err.message ?? 'Failed to create package');
    }
    const pkg = await res.json() as { id: string };

    // Add itinerary days one by one
    for (const day of input.itinerary ?? []) {
      await fetch(`${API_URL}/packages/${pkg.id}/itinerary`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          day:            day.day,
          title:          day.title,
          description:    day.description,
          destinations:   day.attractions.map((a) => a.label).join(', '),
          airportPickup:  day.airportPickup  ?? false,
          airportDropoff: day.airportDropoff ?? false,
        }),
      });
    }

    // Add inclusions one by one
    for (const inc of input.inclusions ?? []) {
      await fetch(`${API_URL}/packages/${pkg.id}/inclusions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          inclusion: inc.description,
          type:      inc.type,
        }),
      });
    }

    return mapPackage(pkg as Record<string, unknown>);
  },

  // Legacy alias
  async createPackage(data: CreatePackageInput): Promise<TourPackage> {
    return PackageAPI.create(data);
  },

  async update(id: string, input: Partial<CreatePackageInput>): Promise<TourPackage> {
    const res = await fetch(`${API_URL}/packages/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(err.message ?? 'Failed to update package');
    }
    return mapPackage(await res.json() as Record<string, unknown>);
  },

  // Legacy alias
  async updatePackage(id: string, data: Partial<CreatePackageInput>): Promise<TourPackage> {
    return PackageAPI.update(id, data);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete package');
  },

  // Legacy alias
  async deletePackage(id: string): Promise<void> {
    return PackageAPI.delete(id);
  },

  async feature(id: string): Promise<TourPackage> {
    const res = await fetch(`${API_URL}/packages/${id}/feature`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to feature package');
    return mapPackage(await res.json() as Record<string, unknown>);
  },

  // Legacy alias
  async featurePackage(id: string): Promise<TourPackage> {
    return PackageAPI.feature(id);
  },

  async deactivate(id: string): Promise<TourPackage> {
    const res = await fetch(`${API_URL}/packages/${id}/deactivate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to deactivate package');
    return mapPackage(await res.json() as Record<string, unknown>);
  },

  // Legacy alias
  async deactivatePackage(id: string): Promise<TourPackage> {
    return PackageAPI.deactivate(id);
  },

  async addItinerary(
    packageId: string,
    day: { day: number; title: string; description: string; attractions: { label: string }[]; airportPickup?: boolean; airportDropoff?: boolean },
  ): Promise<void> {
    await fetch(`${API_URL}/packages/${packageId}/itinerary`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        day:            day.day,
        title:          day.title,
        description:    day.description,
        destinations:   day.attractions.map((a) => a.label).join(', '),
        airportPickup:  day.airportPickup  ?? false,
        airportDropoff: day.airportDropoff ?? false,
      }),
    });
  },

  // Legacy alias
  async addItineraryDay(id: string, data: Record<string, unknown>): Promise<void> {
    await fetch(`${API_URL}/packages/${id}/itinerary`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  async updateItinerary(
    packageId: string,
    dayNumber: number,
    data: Partial<{ title: string; description: string; attractions: { label: string }[]; airportPickup: boolean; airportDropoff: boolean }>,
  ): Promise<void> {
    const body: Record<string, unknown> = { ...data };
    if (data.attractions) {
      body.destinations = data.attractions.map((a) => a.label).join(', ');
      delete body.attractions;
    }
    await fetch(`${API_URL}/packages/${packageId}/itinerary/${dayNumber}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
  },

  // Legacy alias
  async updateItineraryDay(id: string, day: number, data: Record<string, unknown>): Promise<void> {
    await fetch(`${API_URL}/packages/${id}/itinerary/${day}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  async addInclusion(
    packageId: string,
    inc: { description: string; type: string },
  ): Promise<void> {
    await fetch(`${API_URL}/packages/${packageId}/inclusions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ inclusion: inc.description, type: inc.type }),
    });
  },

  // Legacy alias
  async updateInclusions(id: string, data: Record<string, unknown>): Promise<void> {
    await fetch(`${API_URL}/packages/${id}/inclusions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },
};
