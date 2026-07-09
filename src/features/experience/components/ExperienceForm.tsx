'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { API_URL } from '@/lib/api/config';
import { useCreateExperience, useUpdateExperience, useExperienceById } from '../hooks/useExperience';
import type { CreateExperienceInput } from '../api/experience.api';

const CATEGORIES = [
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'NATURE', label: 'Nature & Wildlife' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'RELAXATION', label: 'Relaxation & Spa' },
  { value: 'FAMILY', label: 'Family-Friendly' },
  { value: 'ROMANTIC', label: 'Romantic Escapes' },
];

const EMPTY: CreateExperienceInput = {
  name: '', description: '', category: 'ADVENTURE',
  price: 0, duration: '', image: '', images: [],
  location: '', districtId: '', featured: false, status: 'ACTIVE',
};

interface District { id: string; name: string; }

interface Props {
  experienceId?: string;
  redirectTo?: string;
}

export function ExperienceForm({ experienceId, redirectTo = '/admin/experiences' }: Props) {
  const router = useRouter();
  const isEdit = !!experienceId;

  const { data: existing, isLoading: loadingExisting } = useExperienceById(experienceId ?? null);
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();

  const [form, setForm] = useState<CreateExperienceInput>(EMPTY);
  const [imageInput, setImageInput] = useState('');
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/districts`)
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setDistricts(Array.isArray(d) ? d : (d?.data ?? [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        description: existing.description,
        category: existing.category,
        price: Number(existing.price),
        duration: existing.duration,
        image: existing.image ?? '',
        images: Array.isArray(existing.images) ? existing.images as string[] : [],
        location: existing.location ?? '',
        districtId: existing.districtId ?? '',
        featured: existing.featured,
        status: existing.status,
      });
    }
  }, [existing]);

  if (isEdit && loadingExisting) return <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />;
  if (isEdit && !existing) return <p className="text-sm text-red-600">Experience not found.</p>;

  const set = <K extends keyof CreateExperienceInput>(k: K, v: CreateExperienceInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const payload = {
      ...form,
      price: Number(form.price),
      images: form.images?.filter(Boolean) ?? [],
      districtId: form.districtId || undefined,
      image: form.image || undefined,
      location: form.location || undefined,
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: experienceId!, data: payload },
        { onSuccess: () => router.push(redirectTo) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => router.push(redirectTo) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6 space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name *</label>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} className="mt-1" />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description *</label>
          <Textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="mt-1" />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium">Category *</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
          >
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Price + Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price (USD) *</label>
            <Input type="number" min={0} step="0.01" value={form.price} onChange={(e) => set('price', Number(e.target.value))} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Duration *</label>
            <Input placeholder='e.g. "3 hours"' value={form.duration} onChange={(e) => set('duration', e.target.value)} className="mt-1" />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="text-sm font-medium">Main Image URL</label>
          <Input placeholder="https://..." value={form.image ?? ''} onChange={(e) => set('image', e.target.value)} className="mt-1" />
        </div>

        {/* Additional Images */}
        <div>
          <label className="text-sm font-medium">Additional Images</label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="https://..."
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (imageInput.trim()) {
                  set('images', [...(form.images ?? []), imageInput.trim()]);
                  setImageInput('');
                }
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(form.images ?? []).map((url, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-0.5 text-xs truncate max-w-[220px]">
                {url}
                <button
                  onClick={() => set('images', (form.images ?? []).filter((_, idx) => idx !== i))}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Location + District */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input placeholder="e.g. Sigiriya" value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">District</label>
            <select
              value={form.districtId ?? ''}
              onChange={(e) => set('districtId', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
            >
              <option value="">— None —</option>
              {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        {/* Status + Featured */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={form.status ?? 'ACTIVE'}
              onChange={(e) => set('status', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured ?? false}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium">Featured</label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Experience')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
