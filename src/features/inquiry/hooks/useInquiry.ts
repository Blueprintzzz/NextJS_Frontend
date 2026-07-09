'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InquiryAPI } from '../api/inquiry.api';
import type { InquiryFilters, CreateInquiryInput, InquiryStatus } from '../types/inquiry.types';

const EMPTY_PAGE = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

export function useInquiries(filters?: InquiryFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['inquiries', 'list', filters],
    queryFn: () => InquiryAPI.getInquiries(filters),
  });
  return { data: data ?? EMPTY_PAGE, isLoading, isError };
}

export function useInquiryById(id: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['inquiries', 'detail', id],
    queryFn: () => InquiryAPI.getInquiryById(id!),
    enabled: !!id,
  });
  return { data: data ?? null, isLoading, isError };
}

export function useCreateInquiry() {
  return useMutation({
    mutationFn: (data: CreateInquiryInput) => InquiryAPI.createInquiry(data),
    onError: (err: Error) => toast.error(err.message ?? 'Failed to send inquiry'),
  });
}

export function useRespondInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => InquiryAPI.respondInquiry(id, message),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['inquiries', 'list'] });
      toast.success('Response sent');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to send response'),
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InquiryStatus }) => InquiryAPI.updateInquiry(id, { status }),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['inquiries', 'list'] });
      toast.success('Status updated');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update status'),
  });
}

export function useCloseInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InquiryAPI.closeInquiry(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['inquiries', 'list'] });
      toast.success('Inquiry closed');
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to close inquiry'),
  });
}
