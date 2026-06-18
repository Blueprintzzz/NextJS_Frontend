export { ContactForm } from './components/ContactForm';
export { InquiryList } from './components/InquiryList';
export { InquiryStatusBadge } from './components/InquiryStatusBadge';
export { InquiryPriorityBadge } from './components/InquiryPriorityBadge';

export {
  useInquiries,
  useInquiryById,
  useCreateInquiry,
  useRespondInquiry,
  useUpdateInquiryStatus,
  useCloseInquiry,
} from './hooks/useInquiry';

export { InquiryAPI } from './api/inquiry.api';

export type {
  Inquiry,
  InquiryStatus,
  InquiryCategory,
  InquiryFilters,
  CreateInquiryInput,
  InquiryResponse,
  InquiryPaginationResponse,
} from './types/inquiry.types';
