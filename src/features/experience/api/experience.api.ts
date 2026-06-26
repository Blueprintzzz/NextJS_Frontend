'use client';

import { useQuery } from '@tanstack/react-query';
import type { ExperienceFilters, ExperienceCategory } from '../types/experience.types';
import type { Experience } from '../types/experience.types';

const mockExperiences: Experience[] = [
  {
    id: '1',
    name: 'Sigiriya Rock Climbing Adventure',
    description: 'Scale the ancient rock fortress with professional guides and breathtaking views of the surrounding landscape.',
    category: 'ADVENTURE',
    duration: '2-3 hours',
    price: 85,
    rating: 4.8,
    reviewCount: 156,
    image: 'https://picsum.photos/600/400?random=exp1',
    featured: true,
  },
  {
    id: '2',
    name: 'Whale Watching in Mirissa',
    description: 'Early morning boat tour to spot magnificent blue whales and dolphins in their natural habitat.',
    category: 'NATURE',
    duration: '4-5 hours',
    price: 120,
    rating: 4.9,
    reviewCount: 243,
    image: 'https://picsum.photos/600/400?random=exp2',
    featured: true,
  },
  {
    id: '3',
    name: 'Traditional Dance Workshop',
    description: 'Learn the art of Sri Lankan traditional dance from local masters in a authentic setting.',
    category: 'CULTURAL',
    duration: '2 hours',
    price: 45,
    rating: 4.6,
    reviewCount: 89,
    image: 'https://picsum.photos/600/400?random=exp3',
    featured: true,
  },
  {
    id: '4',
    name: 'Ayurvedic Spa Retreat',
    description: 'Rejuvenate with authentic Ayurvedic treatments and holistic wellness therapies.',
    category: 'RELAXATION',
    duration: '3 hours',
    price: 95,
    rating: 4.7,
    reviewCount: 178,
    image: 'https://picsum.photos/600/400?random=exp4',
    featured: true,
  },
  {
    id: '5',
    name: 'Elephant Orphanage Visit',
    description: 'Meet rescued elephants and learn about conservation efforts at Pinnawala Elephant Orphanage.',
    category: 'FAMILY',
    duration: '1-2 hours',
    price: 35,
    rating: 4.5,
    reviewCount: 201,
    image: 'https://picsum.photos/600/400?random=exp5',
    featured: false,
  },
  {
    id: '6',
    name: 'Romantic Sunset Cruise',
    description: 'Private catamaran cruise at sunset with champagne and stunning ocean views.',
    category: 'ROMANTIC',
    duration: '2 hours',
    price: 180,
    rating: 4.9,
    reviewCount: 92,
    image: 'https://picsum.photos/600/400?random=exp6',
    featured: true,
  },
];

export class ExperienceAPI {
  static async getExperiences(filters?: ExperienceFilters): Promise<Experience[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let result = [...mockExperiences];

    if (filters?.category && filters.category !== 'ALL') {
      result = result.filter((e) => e.category === filters.category);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(search) || e.description.toLowerCase().includes(search)
      );
    }

    return result;
  }

  static async getExperienceById(id: string): Promise<Experience> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const exp = mockExperiences.find((e) => e.id === id);
    if (!exp) throw new Error('Experience not found');
    return exp;
  }

  static async getFeaturedExperiences(): Promise<Experience[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockExperiences.filter((e) => e.featured);
  }

  static async getExperiencesByCategory(category: ExperienceCategory): Promise<Experience[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockExperiences.filter((e) => e.category === category);
  }
}