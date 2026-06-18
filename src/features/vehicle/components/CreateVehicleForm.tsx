'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateVehicle } from '../hooks/useVehicles';
import type { CreateVehicleInput, VehicleType, VehicleStatus } from '../types/vehicle.types';

const TYPES: VehicleType[] = ['CAR', 'SUV', 'VAN', 'MINIBUS', 'LUXURY'];

const EMPTY: CreateVehicleInput = {
  name: '', registrationNumber: '', type: 'CAR', capacity: 4, pricePerDay: 0,
  images: [], features: [], description: '', status: 'ACTIVE',
};

export function CreateVehicleForm() {
  const router = useRouter();
  const mutation = useCreateVehicle();
  const [form, setForm] = useState<CreateVehicleInput>(EMPTY);

  const set = <K extends keyof CreateVehicleInput>(k: K, v: CreateVehicleInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form, { onSuccess: () => router.push('/admin/vehicles') });
  };

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Registration Number *</label>
            <Input value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} placeholder="e.g. WP CAB-1234" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type *</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as VehicleType)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
              >
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={form.status}
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
              <Input type="number" min={1} value={form.capacity} onChange={(e) => set('capacity', Number(e.target.value))} required />
            </div>
            <div>
              <label className="text-sm font-medium">Price/Day (USD) *</label>
              <Input type="number" min={0} step="0.01" value={form.pricePerDay} onChange={(e) => set('pricePerDay', Number(e.target.value))} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Features (comma-separated)</label>
            <Input
              value={form.features.join(', ')}
              onChange={(e) => set('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="AC, GPS, WiFi"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Image URLs (comma-separated)</label>
            <Input
              value={form.images.join(', ')}
              onChange={(e) => set('images', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
