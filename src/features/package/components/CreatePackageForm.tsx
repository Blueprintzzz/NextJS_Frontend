'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useCreatePackage } from '../hooks/usePackages';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../utils/package.utils';
import type { CreatePackageInput, PackageItinerary, PackageInclusion } from '../types/package.types';

const STEPS = ['Basic Info', 'Details', 'Itinerary', 'Inclusions'];

const EMPTY: CreatePackageInput = {
  name: '', description: '', category: 'ADVENTURE', duration: 1, basePrice: 0,
  highlights: [], bestSeason: '', maxCapacity: 10, images: [],
  itinerary: [], inclusions: [], status: 'DRAFT',
};

export function CreatePackageForm() {
  const router = useRouter();
  const mutation = useCreatePackage();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreatePackageInput>(EMPTY);
  const [highlightInput, setHighlightInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const set = <K extends keyof CreatePackageInput>(k: K, v: CreatePackageInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addItineraryDay = () => set('itinerary', [
    ...form.itinerary,
    { day: form.itinerary.length + 1, title: '', description: '', attractions: [] },
  ]);

  const updateDay = (i: number, patch: Partial<PackageItinerary>) =>
    set('itinerary', form.itinerary.map((d, idx) => idx === i ? { ...d, ...patch } : d));

  const addInclusion = () => set('inclusions', [
    ...form.inclusions,
    { type: 'MEAL', description: '' },
  ]);

  const updateInclusion = (i: number, patch: Partial<PackageInclusion>) =>
    set('inclusions', form.inclusions.map((inc, idx) => idx === i ? { ...inc, ...patch } : inc));

  const handleSubmit = () => {
    mutation.mutate(form, { onSuccess: () => router.push('/packages') });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Steps */}
      <div className="flex gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <p className={`text-xs mt-1 text-center ${i === step ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>{label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {step === 0 && (
            <>
              <div><label className="text-sm font-medium">Name *</label><Input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
              <div>
                <label className="text-sm font-medium">Category *</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value as CreatePackageInput['category'])} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1">
                  {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Duration (days)</label><Input type="number" min={1} value={form.duration} onChange={(e) => set('duration', Number(e.target.value))} /></div>
                <div><label className="text-sm font-medium">Base Price (USD)</label><Input type="number" min={0} step="0.01" value={form.basePrice} onChange={(e) => set('basePrice', Number(e.target.value))} /></div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as CreatePackageInput['status'])} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1">
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div><label className="text-sm font-medium">Description *</label><Textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Best Season</label><Input value={form.bestSeason} onChange={(e) => set('bestSeason', e.target.value)} placeholder="e.g. October – March" /></div>
                <div><label className="text-sm font-medium">Max Capacity</label><Input type="number" min={1} value={form.maxCapacity} onChange={(e) => set('maxCapacity', Number(e.target.value))} /></div>
              </div>
              <div>
                <label className="text-sm font-medium">Highlights</label>
                <div className="flex gap-2 mt-1">
                  <Input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Add highlight" onKeyDown={(e) => { if (e.key === 'Enter' && highlightInput.trim()) { set('highlights', [...form.highlights, highlightInput.trim()]); setHighlightInput(''); } }} />
                  <Button type="button" variant="outline" onClick={() => { if (highlightInput.trim()) { set('highlights', [...form.highlights, highlightInput.trim()]); setHighlightInput(''); } }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-0.5 text-xs">
                      {h}<button onClick={() => set('highlights', form.highlights.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Image URLs</label>
                <div className="flex gap-2 mt-1">
                  <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://..." />
                  <Button type="button" variant="outline" onClick={() => { if (imageInput.trim()) { set('images', [...form.images, imageInput.trim()]); setImageInput(''); } }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.images.map((url, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-0.5 text-xs truncate max-w-[200px]">
                      {url}<button onClick={() => set('images', form.images.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {form.itinerary.map((day, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Day {day.day}</p>
                  <Input placeholder="Title" value={day.title} onChange={(e) => updateDay(i, { title: e.target.value })} />
                  <Textarea placeholder="Description" rows={2} value={day.description} onChange={(e) => updateDay(i, { description: e.target.value })} />
                  <Input placeholder="Attractions (comma separated)" value={day.attractions.join(', ')} onChange={(e) => updateDay(i, { attractions: e.target.value.split(',').map((a) => a.trim()).filter(Boolean) })} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addItineraryDay}>+ Add Day</Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {form.inclusions.map((inc, i) => (
                <div key={i} className="flex gap-2">
                  <select value={inc.type} onChange={(e) => updateInclusion(i, { type: e.target.value as PackageInclusion['type'] })} className="rounded-md border border-gray-300 px-2 py-2 text-sm">
                    <option value="MEAL">Meal</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="ACCOMMODATION">Accommodation</option>
                    <option value="ACTIVITY">Activity</option>
                  </select>
                  <Input className="flex-1" placeholder="Description" value={inc.description} onChange={(e) => updateInclusion(i, { description: e.target.value })} />
                  <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => set('inclusions', form.inclusions.filter((_, idx) => idx !== i))}>×</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addInclusion}>+ Add Inclusion</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => step === 0 ? router.back() : setStep((s) => s - 1)}>
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create Package'}
          </Button>
        )}
      </div>
    </div>
  );
}
