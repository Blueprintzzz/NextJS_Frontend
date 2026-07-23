'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PriceInput } from '@/components/shared/PriceInput';
import { useUpdateVehicle, useVehicleById } from '../hooks/useVehicles';
import type { CreateVehicleInput, VehicleType, VehicleStatus } from '../types/vehicle.types';

const TYPES: VehicleType[] = ['CAR', 'SUV', 'VAN', 'MINIBUS', 'LUXURY'];

interface Props { id: string; }

export function EditVehicleForm({ id }: Props) {
  const router = useRouter();
  const { data: vehicle, isLoading } = useVehicleById(id);
  const mutation = useUpdateVehicle();
  const [form, setForm] = useState<Partial<CreateVehicleInput>>({});
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vehicle) {
      setForm({ ...vehicle });
      setPreviews(vehicle.images ?? []);
    }
  }, [vehicle]);

  const set = <K extends keyof CreateVehicleInput>(k: K, v: CreateVehicleInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    const merged = [...previews, ...urls];
    setPreviews(merged);
    set('images', merged);
  };

  const removeImage = (i: number) => {
    const next = previews.filter((_, idx) => idx !== i);
    setPreviews(next);
    set('images', next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ id, data: form }, { onSuccess: () => router.push('/admin/vehicles') });
  };

  if (isLoading) return <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />;
  if (!vehicle) return <p className="text-gray-500">Vehicle not found.</p>;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium">Registration Number</label>
              <Input value={form.registrationNumber ?? ''} onChange={(e) => set('registrationNumber', e.target.value)} placeholder="e.g. WP CAB-1234" />
            </div>
            <div>
              <label className="text-sm font-medium">Type *</label>
              <select
                value={form.type ?? 'CAR'}
                onChange={(e) => set('type', e.target.value as VehicleType)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
              >
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={form.status ?? 'ACTIVE'}
                onChange={(e) => set('status', e.target.value as VehicleStatus)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Capacity *</label>
              <Input type="number" min={1} value={form.capacity ?? ''} onChange={(e) => set('capacity', Number(e.target.value))} required />
            </div>
            <div>
              <PriceInput
                label="Price/Day (USD) *"
                hint="Per day rate in USD"
                value={form.pricePerDay ?? 0}
                onChange={(v) => set('pricePerDay', v)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Features (comma-separated)</label>
            <Input
              value={(form.features ?? []).join(', ')}
              onChange={(e) => set('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Images</label>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              Upload Images
            </Button>
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <Image src={src} alt={`preview-${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
