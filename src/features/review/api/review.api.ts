import { apiRequest } from '@/lib/api';
import type {
  Review,
  ReviewFilters,
  ReviewPaginationResponse,
  CreateReviewInput,
} from '../types/review.types';

const EMPTY_PAGE: ReviewPaginationResponse = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const ReviewAPI = {
  async getReviews(filters?: ReviewFilters): Promise<ReviewPaginationResponse> {
    try {
      return (await apiRequest(`/reviews${buildQuery(filters as Record<string, unknown>)}`)) as ReviewPaginationResponse ?? EMPTY_PAGE;
    } catch { return EMPTY_PAGE; }
  },

  async getReviewById(id: string): Promise<Review | null> {
    try { return (await apiRequest(`/reviews/${id}`)) as Review; } catch { return null; }
  },

  async getPackageReviews(packageId: string, page = 1): Promise<ReviewPaginationResponse> {
    try {
      return (await apiRequest(`/packages/${packageId}/reviews?page=${page}`)) as ReviewPaginationResponse ?? EMPTY_PAGE;
    } catch { return EMPTY_PAGE; }
  },

  async getUserReviews(userId: string): Promise<ReviewPaginationResponse> {
    try {
      return (await apiRequest(`/users/${userId}/reviews`)) as ReviewPaginationResponse ?? EMPTY_PAGE;
    } catch { return EMPTY_PAGE; }
  },

  async createReview(data: CreateReviewInput): Promise<Review> {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<Review>;
  },

  async updateReview(id: string, data: Partial<CreateReviewInput>): Promise<Review> {
    return apiRequest(`/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<Review>;
  },

  async deleteReview(id: string): Promise<void> {
    await apiRequest(`/reviews/${id}`, { method: 'DELETE' });
  },

  async approveReview(id: string): Promise<Review> {
    return apiRequest(`/reviews/${id}/approve`, { method: 'POST' }) as Promise<Review>;
  },

  async rejectReview(id: string): Promise<Review> {
    return apiRequest(`/reviews/${id}/reject`, { method: 'POST' }) as Promise<Review>;
  },

  async markHelpful(reviewId: string): Promise<void> {
    await apiRequest(`/reviews/${reviewId}/helpful`, { method: 'POST' });
  },
};
