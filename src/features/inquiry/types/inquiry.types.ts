export type InquiryStatus = 'NEW' | 'RESPONDED' | 'CLOSED';
export type InquiryPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type InquiryCategory = 'BOOKING' | 'GENERAL' | 'COMPLAINT' | 'SUGGESTION';

export interface InquiryResponse {
  id: string;
  inquiryId: string;
  adminId: string;
  adminName: string;
  message: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  category: InquiryCategory;
  responses: InquiryResponse[];
  assignedAdmin?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface InquiryFilters {
  status?: InquiryStatus;
  priority?: InquiryPriority;
  category?: InquiryCategory;
  page?: number;
  limit?: number;
}

export interface InquiryPaginationResponse {
  data: Inquiry[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: InquiryCategory;
}
