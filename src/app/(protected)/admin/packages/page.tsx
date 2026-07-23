'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { usePackages } from '@/features/package';
import { PackageAPI } from '@/features/package';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { PackageStatus, PackageCategory, PackageFilterParams } from '@/features/package';

const CATEGORIES: (PackageCategory | 'ALL')[] = ['ALL', 'ADVENTURE', 'NATURE', 'ROMANTIC', 'WILDLIFE', 'FAMILY', 'CULTURAL', 'BEACH', 'LUXURY'];

export default function AdminPackagesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<PackageCategory | undefined>();
  const [status, setStatus] = useState<PackageStatus | undefined>();
  const { data, isLoading } = usePackages({ category, ...(status ? { status } : {}) } as Parameters<typeof usePackages>[0]);

  async function handleFeature(id: string) {
    try {
      await PackageAPI.featurePackage(id);
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Featured status updated');
    } catch { toast.error('Failed to update'); }
  }

  async function handleToggleStatus(id: string, current: PackageStatus) {
    try {
      if (current === 'ACTIVE') {
        await PackageAPI.deactivatePackage(id);
        toast.success('Package deactivated');
      } else {
        await PackageAPI.updatePackage(id, { status: 'ACTIVE' });
        toast.success('Package activated');
      }
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    } catch { toast.error('Failed to update status'); }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Tour Package Management</h1>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c === 'ALL' ? undefined : c as PackageCategory)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                (c === 'ALL' && !category) || category === c
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-300 text-gray-600 hover:border-gray-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={status ?? ''}
          onChange={e => setStatus((e.target.value as PackageStatus) || undefined)}
          className="ml-auto px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Category', 'Duration', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              : data.data.length === 0
              ? <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No packages found.</td></tr>
              : data.data.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{pkg.name}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.category}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.duration}d</td>
                    <td className="px-4 py-3 text-gray-700">${pkg.basePrice.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        pkg.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        pkg.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{pkg.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/packages/${pkg.id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeature(pkg.id)}
                          className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded"
                          title="Toggle Featured"
                        >
                          <Star className={`w-4 h-4 ${pkg.rating ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(pkg.id, pkg.status)}
                          className={`p-1.5 rounded ${pkg.status === 'ACTIVE' ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={pkg.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          {pkg.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
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
