'use client';

import { useState } from 'react';
import { Eye, CheckCircle, XCircle, FileText } from 'lucide-react';

type DriverStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';

interface AdminDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  vehicleCount: number;
  createdAt: string;
}

// Placeholder — replace with real API hook when driver management endpoint is available
function useAdminDrivers() {
  return { data: [] as AdminDriver[], isLoading: false };
}

const STATUS_FILTER: { label: string; value: DriverStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Rejected', value: 'REJECTED' },
];

function statusBadge(status: DriverStatus) {
  const map: Record<DriverStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    VERIFIED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ACTIVE: 'bg-teal-100 text-teal-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export default function AdminDriversPage() {
  const [filter, setFilter] = useState<DriverStatus | 'ALL'>('ALL');
  const { data, isLoading } = useAdminDrivers();

  const filtered = filter === 'ALL' ? data : data.filter(d => d.status === filter);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>

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
              {['Name', 'Email', 'License No.', 'Expiry', 'Vehicles', 'Status', 'Actions'].map(h => (
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
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No drivers found.</td></tr>
              : filtered.map(driver => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{driver.name}</td>
                    <td className="px-4 py-3 text-gray-600">{driver.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{driver.licenseNumber}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{new Date(driver.licenseExpiry).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{driver.vehicleCount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(driver.status)}`}>{driver.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded" title="View Profile"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="View License"><FileText className="w-4 h-4" /></button>
                        {driver.status === 'PENDING' && (
                          <>
                            <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Reject"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
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
