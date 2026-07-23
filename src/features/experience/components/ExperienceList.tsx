'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExperiencesPaginated, useDeleteExperience, useToggleFeatureExperience } from '../hooks/useExperience';
import type { ExperienceCategory } from '../types/experience.types';

const CATEGORIES: { value: ExperienceCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'NATURE', label: 'Nature' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'RELAXATION', label: 'Relaxation' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'ROMANTIC', label: 'Romantic' },
];

export function ExperienceList({ editBasePath = '/admin/experiences', readonlyFeatured = false }: { editBasePath?: string; readonlyFeatured?: boolean }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExperienceCategory | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useExperiencesPaginated({
    search: search || undefined,
    category,
    page,
    limit: 10,
  });

  const deleteMutation = useDeleteExperience();
  const featureMutation = useToggleFeatureExperience();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search experiences..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value as ExperienceCategory | 'ALL'); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {isError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          Failed to load experiences.
        </p>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">{data.total} experience{data.total !== 1 ? 's' : ''} found</p>

          {data.data.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No experiences match your filters.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Duration</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-center">Featured</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {data.data.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="relative w-12 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          {exp.image ? (
                            <Image src={exp.image} alt={exp.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">—</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{exp.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">${Number(exp.price).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{exp.duration}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">{exp.location ?? '—'}</td>
                      <td className="px-4 py-3 text-center">
                        {readonlyFeatured ? (
                          <Star className={`w-4 h-4 mx-auto ${exp.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ) : (
                          <button
                            onClick={() => featureMutation.mutate(exp.id)}
                            disabled={featureMutation.isPending}
                            title={exp.featured ? 'Unfeature' : 'Feature'}
                            className="inline-flex items-center justify-center"
                          >
                            <Star
                              className={`w-4 h-4 ${exp.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          exp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`${editBasePath}/${exp.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(exp.id, exp.name)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.pages > 1 && (
            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-gray-500">Page {data.page} of {data.pages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
