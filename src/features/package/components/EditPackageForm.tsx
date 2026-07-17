'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PriceInput } from '@/components/shared/PriceInput';
import { usePackageById, useUpdatePackage } from '../hooks/usePackages';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../utils/package.utils';
import type { CreatePackageInput } from '../types/package.types';

interface Props {
  packageId: string;
}

export function EditPackageForm({ packageId }: Props) {
  const router = useRouter();
  const { data: pkg, isLoading } = usePackageById(packageId);
  const mutation = useUpdatePackage();
  const [form, setForm] = useState<Partial<CreatePackageInput>>({});

  useEffect(() => {
    if (pkg) setForm({
      name: pkg.name, description: pkg.description, category: pkg.category,
      duration: pkg.duration, basePrice: pkg.basePrice, bestSeason: pkg.bestSeason,
      maxCapacity: pkg.maxCapacity, status: pkg.status, highlights: pkg.highlights,
      images: pkg.images, itinerary: pkg.itinerary, inclusions: pkg.inclusions,
    });
  }, [pkg]);

  if (isLoading) return <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />;
  if (!pkg) return <p className="text-sm text-red-600">Package not found.</p>;

  const set = <K extends keyof CreatePackageInput>(k: K, v: CreatePackageInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6 space-y-4">
        <div><label className="text-sm font-medium">Name</label><Input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} /></div>
        <div><label className="text-sm font-medium">Description</label><Textarea rows={4} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} /></div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <select value={form.category ?? 'ADVENTURE'} onChange={(e) => set('category', e.target.value as CreatePackageInput['category'])} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1">
            {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Duration (days)</label><Input type="number" min={1} value={form.duration ?? 1} onChange={(e) => set('duration', Number(e.target.value))} /></div>
          <PriceInput
            label="Base Price (USD)"
            hint="Enter amount in USD"
            value={form.basePrice ?? 0}
            onChange={(v) => set('basePrice', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Best Season</label><Input value={form.bestSeason ?? ''} onChange={(e) => set('bestSeason', e.target.value)} /></div>
          <div><label className="text-sm font-medium">Max Capacity</label><Input type="number" min={1} value={form.maxCapacity ?? 1} onChange={(e) => set('maxCapacity', Number(e.target.value))} /></div>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select value={form.status ?? 'DRAFT'} onChange={(e) => set('status', e.target.value as CreatePackageInput['status'])} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1">
            <option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="flex justify-between pt-2">
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate({ id: packageId, data: form }, { onSuccess: () => router.push(`/packages/${packageId}`) })}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
