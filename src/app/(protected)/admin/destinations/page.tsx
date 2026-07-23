'use client';

import { useState } from 'react';
import { Pencil, Trash2, Star, Plus } from 'lucide-react';
import { useDistricts } from '@/features/destination';
import { DestinationAPI } from '@/features/destination';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminDestinationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const { data: districts, isLoading } = useDistricts(search || undefined);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove destination "${name}"?`)) return;
    try {
      await DestinationAPI.deleteDistrict(id);
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('Destination removed');
    } catch { toast.error('Failed to remove destination'); }
  }

  async function handleFeature(id: string) {
    try {
      await DestinationAPI.setDistrictFeatured(id);
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('Featured status updated');
    } catch { toast.error('Failed to update featured status'); }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Destination Management</h1>
        <button
          onClick={() => toast.info('Add destination form — connect to modal or page')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      <input
        type="text"
        placeholder="Search destinations…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Best Season', 'Attractions', 'Featured', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              : districts.length === 0
              ? <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No destinations found.</td></tr>
              : districts.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                    <td className="px-4 py-3 text-gray-600">{d.bestVisitingSeason}</td>
                    <td className="px-4 py-3 text-gray-600">{d.attractions?.length ?? '—'}</td>
                    <td className="px-4 py-3">
                      {d.featured
                        ? <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">Featured</span>
                        : <span className="text-gray-400 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toast.info(`Edit destination ${d.id}`)}
                          className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeature(d.id)}
                          className={`p-1.5 rounded ${d.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title="Toggle Featured"
                        >
                          <Star className={`w-4 h-4 ${d.featured ? 'fill-yellow-400' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
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
