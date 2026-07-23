'use client';

import { useState } from 'react';
import { Eye, CheckCircle, XCircle, UserX, UserCheck } from 'lucide-react';

type SupplierStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';

interface AdminSupplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  experienceCount: number;
  status: SupplierStatus;
  createdAt: string;
}

// Placeholder — replace with real API hook when supplier management endpoint is available
function useAdminSuppliers() {
  return { data: [] as AdminSupplier[], isLoading: false };
}

const STATUS_FILTER: { label: string; value: SupplierStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

function statusBadge(status: SupplierStatus) {
  const map: Record<SupplierStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    VERIFIED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ACTIVE: 'bg-teal-100 text-teal-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export default function AdminSuppliersPage() {
  const [filter, setFilter] = useState<SupplierStatus | 'ALL'>('ALL');
  const { data, isLoading } = useAdminSuppliers();

  const filtered = filter === 'ALL' ? data : data.filter(s => s.status === filter);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Experience Supplier Management</h1>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTER.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              filter === f.value ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600 hover:border-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Email', 'Business', 'Experiences', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              : filtered.length === 0
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No suppliers found.</td></tr>
              : filtered.map(supplier => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{supplier.name}</td>
                    <td className="px-4 py-3 text-gray-600">{supplier.email}</td>
                    <td className="px-4 py-3 text-gray-700">{supplier.businessName}</td>
                    <td className="px-4 py-3 text-gray-600">{supplier.experienceCount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(supplier.status)}`}>{supplier.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(supplier.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                        {supplier.status === 'PENDING' && (
                          <>
                            <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Verify"><CheckCircle className="w-4 h-4" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Reject"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                        {supplier.status === 'ACTIVE'
                          ? <button className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded" title="Deactivate"><UserX className="w-4 h-4" /></button>
                          : supplier.status === 'INACTIVE'
                          ? <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Activate"><UserCheck className="w-4 h-4" /></button>
                          : null
                        }
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
