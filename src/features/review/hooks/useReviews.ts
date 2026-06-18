'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ReviewAPI } from '../api/review.api';
import type { ReviewFilters, CreateReviewInput } from '../types/review.types';

const EMPTY_PAGE = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

export function useReviews(filters?: ReviewFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', 'list', filters],
    queryFn: () => ReviewAPI.getReviews(filters),
  });
  return { data: data ?? EMPTY_PAGE, isLoading, isError };
}

export function usePackageReviews(packageId: string | null, page = 1) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', 'package', packageId, page],
    queryFn: () => ReviewAPI.getPackageReviews(packageId!, page),
    enabled: !!packageId,
  });
  return { data: data ?? EMPTY_PAGE, isLoading, isError };
}

export function usePackageReviewStats(packageId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', 'stats', packageId],
    queryFn: () => ReviewAPI.getPackageReviewStats(packageId!),
    enabled: !!packageId,
  });
  return { data: data ?? null, isLoading };
}

export function useUserReviews(userId: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => ReviewAPI.getUserReviews(userId!),
    enabled: !!userId,
  });
  return { data: data ?? EMPTY_PAGE, isLoading, isError };
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: CreateReviewInput }) =>
      ReviewAPI.createReview(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review submitted successfully');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to submit review'),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateReviewInput> }) =>
      ReviewAPI.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review updated');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update review'),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewAPI.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to delete review'),
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewAPI.approveReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review approved');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to approve review'),
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewAPI.rejectReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review rejected');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to reject review'),
  });
}

export function useMarkHelpful() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => ReviewAPI.markHelpful(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });
}
