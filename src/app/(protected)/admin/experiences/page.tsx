'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  useExperiencesPaginated,
  useDeleteExperience,
  useToggleFeatureExperience,
  useUpdateExperience,
} from '@/features/experience';
import type { ExperienceCategory } from '@/features/experience';

const CATEGORIES: (ExperienceCategory | 'ALL')[] = ['ALL', 'ADVENTURE', 'NATURE', 'CULTURAL', 'RELAXATION', 'FAMILY', 'ROMANTIC'];

export default function AdminExperiencesPage() {
  const router = useRouter();
  const [category, setCategory] = useState<ExperienceCategory | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useExperiencesPaginated({ category, page, limit: 15 });
  const deleteMutation = useDeleteExperience();
  const featureMutation = useToggleFeatureExperience();
  const updateMutation = useUpdateExperience();

  function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateMutation.mutate({ id, data: { status: newStatus } });
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Experience Management</h1>
        <button
          onClick={() => router.push('/admin/experiences/create')}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          + New Experience
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => { setCategory(c === 'ALL' ? undefined : c as ExperienceCategory); setPage(1); }}
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

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Category', 'Price', 'Duration', 'Featured', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              : data.data.length === 0
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No experiences found.</td></tr>
              : data.data.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{exp.name}</td>
                    <td className="px-4 py-3 text-gray-600">{exp.category}</td>
                    <td className="px-4 py-3 text-gray-700">${Number(exp.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{exp.duration}</td>
                    <td className="px-4 py-3">
                      {exp.featured
                        ? <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">Featured</span>
                        : <span className="text-gray-400 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        exp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{exp.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/admin/experiences/${exp.id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => featureMutation.mutate(exp.id)}
                          className={`p-1.5 rounded ${exp.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title="Toggle Featured"
                        >
                          <Star className={`w-4 h-4 ${exp.featured ? 'fill-yellow-400' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(exp.id, exp.status)}
                          className={`p-1.5 rounded ${exp.status === 'ACTIVE' ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={exp.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          {exp.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { if (confirm('Remove this experience?')) deleteMutation.mutate(exp.id); }}
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

      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {data.pages}</span>
          <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      )}
    </div>
  );
}
