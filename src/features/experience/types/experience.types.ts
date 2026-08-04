export interface Experience {
  id: string;
  name: string;
  description: string;
  category: ExperienceCategory;
  price: string | number;
  duration: string;
  image?: string | null;
  images: string[];
  location?: string | null;
  destinationId?: string | null;
  featured: boolean;
  status: string;
  capacity?: number | null;
  availability?: string | null;
  rating?: string | number | null;
  reviewCount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export type ExperienceCategory =
  | 'ADVENTURE'
  | 'NATURE'
  | 'CULTURAL'
  | 'RELAXATION'
  | 'FAMILY'
  | 'ROMANTIC';

export interface ExperienceFilters {
  category?: ExperienceCategory | 'ALL';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedExperiences {
  data: Experience[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}