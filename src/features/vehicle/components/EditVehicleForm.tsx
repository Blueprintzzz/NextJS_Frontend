'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (vehicle) setForm({ ...vehicle });
  }, [vehicle]);

  const set = <K extends keyof CreateVehicleInput>(k: K, v: CreateVehicleInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ id, data: form }, { onSuccess: () => router.push('/admin/vehicles') });
  };

  if (isLoading) return <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />;
  if (!vehicle) return <p className="text-gray-500">Vehicle not found.</p>;

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <label className="text-sm font-medium">Image URLs (comma-separated)</label>
            <Input
              value={(form.images ?? []).join(', ')}
              onChange={(e) => set('images', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
