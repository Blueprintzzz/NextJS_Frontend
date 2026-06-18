'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InquiryStatusBadge } from './InquiryStatusBadge';
import { InquiryPriorityBadge } from './InquiryPriorityBadge';
import { useInquiries } from '../hooks/useInquiry';
import type { InquiryStatus, InquiryPriority, InquiryCategory } from '../types/inquiry.types';

const STATUSES: InquiryStatus[] = ['NEW', 'RESPONDED', 'CLOSED'];
const PRIORITIES: InquiryPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORIES: InquiryCategory[] = ['BOOKING', 'GENERAL', 'COMPLAINT', 'SUGGESTION'];

export function InquiryList() {
  const [status, setStatus] = useState<InquiryStatus | undefined>();
  const [priority, setPriority] = useState<InquiryPriority | undefined>();
  const [category, setCategory] = useState<InquiryCategory | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useInquiries({ status, priority, category, page, limit: 15 });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {([['Status', STATUSES, status, setStatus], ['Priority', PRIORITIES, priority, setPriority], ['Category', CATEGORIES, category, setCategory]] as const).map(([label, opts, val, setter]) => (
          <div key={label as string}>
            <label className="text-xs text-gray-500 block mb-1">{label as string}</label>
            <select
              value={(val as string | undefined) ?? ''}
              onChange={(e) => { (setter as (v: string | undefined) => void)(e.target.value || undefined); setPage(1); }}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">All</option>
              {(opts as string[]).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {isError && <p className="text-sm text-red-600">Failed to load inquiries.</p>}

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />)
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Subject', 'Category', 'Status', 'Priority', 'Date', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No inquiries found.</td></tr>
              )}
              {data.data.map((inq) => (
                <tr key={inq.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{inq.name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{inq.subject}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{inq.category}</td>
                  <td className="px-4 py-3"><InquiryStatusBadge status={inq.status} /></td>
                  <td className="px-4 py-3"><InquiryPriorityBadge priority={inq.priority} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/inquiries/${inq.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && data.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Page {data.page} of {data.pages} · {data.total} total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
