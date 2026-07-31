'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PriceInput } from '@/components/shared/PriceInput';
import { ImageUploadField } from '@/components/shared/ImageUploadField';
import { useCreateVehicle } from '../hooks/useVehicles';
import type { CreateVehicleInput, VehicleType, VehicleStatus } from '../types/vehicle.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type VehicleModel = { id: string; name: string; type: string };

const EMPTY: CreateVehicleInput = {
  vehicleModelId: '', registrationNumber: '', type: 'CAR', capacity: 4,
  pricePerDay: 0, images: [], features: [], description: '', status: 'ACTIVE',
};

export function CreateVehicleForm() {
  const router = useRouter();
  const mutation = useCreateVehicle();
  const [form, setForm] = useState<CreateVehicleInput>(EMPTY);

  const [allModels, setAllModels] = useState<VehicleModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelSearch, setModelSearch] = useState('');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

  const [featureInput, setFeatureInput] = useState('');

  const set = <K extends keyof CreateVehicleInput>(k: K, v: CreateVehicleInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`${API_URL}/vehicle-models`)
      .then(res => res.json())
      .then(data => setAllModels(Array.isArray(data) ? data : data?.data ?? []))
      .catch(() => setAllModels([]))
      .finally(() => setModelsLoading(false));
  }, []);

  const filteredModels = modelSearch.trim().length > 0
    ? allModels.filter(m =>
        m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        m.type.toLowerCase().includes(modelSearch.toLowerCase())
      )
    : allModels;

  function selectModel(model: VehicleModel) {
    setSelectedModel(model);
    set('vehicleModelId', model.id);
    set('type', model.type as VehicleType);
    setModelSearch(model.name);
    setModelDropdownOpen(false);
  }

  function addFeature() {
    const val = featureInput.trim();
    if (val && !form.features.includes(val)) set('features', [...form.features, val]);
    setFeatureInput('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleModelId) { alert('Please select a vehicle model'); return; }
    mutation.mutate(form, { onSuccess: () => router.push('/admin/vehicles') });
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Vehicle Model */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Vehicle Model *</label>
              {!selectedModel ? (
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => { setModelSearch(e.target.value); setSelectedModel(null); }}
                    onFocus={() => setModelDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setModelDropdownOpen(false), 200)}
                    placeholder={modelsLoading ? 'Loading models…' : 'Search model e.g. Toyota HiAce, KDH'}
                    disabled={modelsLoading}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {modelDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {filteredModels.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-gray-400">No models found</div>
                      ) : (
                        filteredModels.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onMouseDown={() => selectModel(m)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0"
                          >
                            <span className="font-medium">{m.name}</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{m.type}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 mt-1">
                  <div>
                    <p className="text-xs font-semibold text-teal-700">✓ {selectedModel.name}</p>
                    <p className="text-xs text-teal-500">Type: {selectedModel.type}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedModel(null); set('vehicleModelId', ''); set('type', 'CAR'); setModelSearch(''); }}
                    className="text-xs text-gray-400 hover:text-red-500 font-medium ml-4"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Registration Number */}
            <div>
              <label className="text-sm font-medium">Registration Number *</label>
              <Input value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} placeholder="e.g. WP CAB-1234" required />
            </div>

            {/* Type — read-only */}
            <div>
              <label className="text-sm font-medium">Type</label>
              <div className="w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm mt-1 text-gray-600">
                {form.type || 'Auto-filled when model is selected'}
              </div>
            </div>

            {/* Status */}
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

            {/* Capacity */}
            <div>
              <label className="text-sm font-medium">Capacity *</label>
              <Input type="number" min={1} value={form.capacity} onChange={(e) => set('capacity', Number(e.target.value))} required />
            </div>

            {/* Price */}
            <div>
              <PriceInput
                label="Price/Day (USD) *"
                hint="Per day rate in USD"
                value={form.pricePerDay}
                onChange={(v) => set('pricePerDay', v)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          {/* Features */}
          <div>
            <label className="text-sm font-medium">Features</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addFeature(); }
                }}
                placeholder="Type feature and press Enter"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700"
              >
                Add
              </button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-xs">
                    {f}
                    <button
                      type="button"
                      onClick={() => set('features', form.features.filter((_, idx) => idx !== i))}
                      className="text-teal-400 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <ImageUploadField
            label="Vehicle Images"
            hint="Add photos of your vehicle"
            multiple
            values={form.images}
            onChangeMultiple={(urls) => set('images', urls)}
          />

          <Button type="submit" className="w-full md:w-auto" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
