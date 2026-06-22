import { apiRequest } from '@/lib/api';
import type {
  Inquiry,
  InquiryFilters,
  InquiryPaginationResponse,
  InquiryResponse,
  CreateInquiryInput,
} from '../types/inquiry.types';

const EMPTY_PAGE: InquiryPaginationResponse = { data: [], total: 0, page: 1, limit: 10, pages: 0 };

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const InquiryAPI = {
  async getInquiries(filters?: InquiryFilters): Promise<InquiryPaginationResponse> {
    try {
      return (await apiRequest(`/inquiries${buildQuery(filters as Record<string, unknown>)}`)) as InquiryPaginationResponse ?? EMPTY_PAGE;
    } catch { return EMPTY_PAGE; }
  },

  async getInquiryById(id: string): Promise<Inquiry | null> {
    try { return (await apiRequest(`/inquiries/${id}`)) as Inquiry; } catch { return null; }
  },

  async createInquiry(data: CreateInquiryInput): Promise<Inquiry> {
    return apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<Inquiry>;
  },

  async updateInquiry(id: string, data: Record<string, unknown>): Promise<Inquiry> {
    return apiRequest(`/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<Inquiry>;
  },

  async deleteInquiry(id: string): Promise<void> {
    await apiRequest(`/inquiries/${id}`, { method: 'DELETE' });
  },

  async respondInquiry(id: string, message: string): Promise<InquiryResponse> {
    return apiRequest(`/inquiries/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }) as Promise<InquiryResponse>;
  },

  async getResponses(inquiryId: string): Promise<InquiryResponse[]> {
    try {
      const raw = await apiRequest(`/inquiries/${inquiryId}/responses`);
      return Array.isArray(raw) ? (raw as InquiryResponse[]) : [];
    } catch { return []; }
  },

  async closeInquiry(id: string): Promise<Inquiry> {
    return apiRequest(`/inquiries/${id}/close`, { method: 'POST' }) as Promise<Inquiry>;
  },
};
