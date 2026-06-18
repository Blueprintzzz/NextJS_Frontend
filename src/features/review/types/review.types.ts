export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  packageId?: string;
  packageName?: string;
  rating: number;
  title: string;
  description: string;
  images: string[];
  status: ReviewStatus;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ReviewFilters {
  rating?: number;
  status?: ReviewStatus;
  packageId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface ReviewPaginationResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreateReviewInput {
  rating: number;
  title: string;
  description: string;
  images?: string[];
}
