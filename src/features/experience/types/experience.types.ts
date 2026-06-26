export interface Experience {
  id: string;
  name: string;
  description: string;
  category: ExperienceCategory;
  duration: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  featured: boolean;
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
}