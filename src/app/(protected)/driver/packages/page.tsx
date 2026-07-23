'use client';

import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { usePackages, useDeletePackage, useUpdatePackage } from '@/features/package';

export default function DriverPackagesPage() {
  const router = useRouter();
  const { data, isLoading } = usePackages({ limit: 20 });
  const deleteMutation = useDeletePackage();
  const updateMutation = useUpdatePackage();

  const toggleStatus = (id: string, current: string) =>
    updateMutation.mutate({ id, data: { status: current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Tour Packages</h1>
        <button
          onClick={() => router.push('/driver/packages/create')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Package
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Category', 'Duration', 'Price', 'Capacity', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              : data.data.length === 0
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No packages yet.</td></tr>
              : data.data.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{pkg.name}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.category}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.duration}d</td>
                    <td className="px-4 py-3 text-gray-600">${pkg.basePrice}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.maxCapacity}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pkg.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : pkg.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => router.push(`/driver/packages/${pkg.id}/edit`)} className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => toggleStatus(pkg.id, pkg.status)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                          {pkg.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { if (confirm('Delete this package?')) deleteMutation.mutate(pkg.id); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
