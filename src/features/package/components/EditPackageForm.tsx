'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStepper } from '@/components/shared/FormStepper';
import { ImageUploadField } from '@/components/shared/ImageUploadField';
import { PriceInput } from '@/components/shared/PriceInput';
import { usePackageById, useUpdatePackage } from '../hooks/usePackages';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../utils/package.utils';
import { apiRequest } from '@/lib/api';
import { API_URL } from '@/lib/api/config';
import type { CreatePackageInput, PackageItinerary, PackageInclusion } from '../types/package.types';

interface Props {
  packageId: string;
  backHref?: string;
}

const STEPS = [
  { label: 'Basic Info',  description: 'Name, category, price' },
  { label: 'Details',     description: 'Description & highlights' },
  { label: 'Itinerary',   description: 'Day-by-day plan' },
  { label: 'Inclusions',  description: 'Meals, transport, etc.' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{children}</label>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
    />
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-6 py-6 space-y-5">
      {children}
    </div>
  );
}

export function EditPackageForm({ packageId, backHref }: Props) {
  const router   = useRouter();
  const { data: pkg, isLoading } = usePackageById(packageId);
  const mutation = useUpdatePackage();

  const [step, setStep]                     = useState(0);
  const [form, setForm]                     = useState<Partial<CreatePackageInput>>({});
  const [highlightInput, setHighlightInput] = useState('');
  const [airportPickup,  setAirportPickup]  = useState(false);
  const [airportDropoff, setAirportDropoff] = useState(false);
  const [seasonStart, setSeasonStart]       = useState('');
  const [seasonEnd,   setSeasonEnd]         = useState('');

  const [picker, setPicker]           = useState<{ open: boolean; dayIndex: number }>({ open: false, dayIndex: 0 });
  const [destinations, setDestinations] = useState<{ id: string; name: string }[]>([]);
  const [pickerSearch,  setPickerSearch]  = useState('');
  const [loadingPicker, setLoadingPicker] = useState(false);
  const [pickerError,   setPickerError]   = useState<string | null>(null);

  const parseSeason = (season: string) => {
    const parts = (season ?? '').split('–').map((s) => s.trim());
    return { start: parts[0] ?? '', end: parts[1] ?? '' };
  };

  useEffect(() => {
    if (!pkg) return;
    const firstDay = pkg.itinerary?.[0];
    const lastDay  = pkg.itinerary?.[pkg.itinerary.length - 1];
    setAirportPickup(firstDay?.airportPickup   ?? false);
    setAirportDropoff(lastDay?.airportDropoff  ?? false);
    const { start, end } = parseSeason(pkg.bestSeason ?? '');
    setSeasonStart(start);
    setSeasonEnd(end);
    setForm({
      name:        pkg.name,
      description: pkg.description,
      category:    pkg.category,
      duration:    pkg.duration,
      basePrice:   pkg.basePrice,
      bestSeason:  pkg.bestSeason,
      maxCapacity: pkg.maxCapacity,
      status:      pkg.status,
      featured:    (pkg as unknown as { featured?: boolean }).featured ?? false,
      highlights:  pkg.highlights   ?? [],
      images:      pkg.images       ?? [],
      itinerary:   pkg.itinerary    ?? [],
      inclusions:  pkg.inclusions   ?? [],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg]);

  if (isLoading) return <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />;
  if (!pkg)      return <p className="text-sm text-red-600">Package not found.</p>;

  const set = <K extends keyof CreatePackageInput>(k: K, v: CreatePackageInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSeasonChange = (start: string, end: string) => {
    if (start && end) set('bestSeason', `${start} – ${end}`);
    else if (start)   set('bestSeason', start);
    else              set('bestSeason', '');
  };

  // ── Itinerary helpers ────────────────────────────────────────────────────
  const addItineraryDay = () =>
    set('itinerary', [
      ...(form.itinerary ?? []),
      { day: (form.itinerary?.length ?? 0) + 1, title: '', description: '', attractions: [] },
    ]);

  const updateDay = (i: number, patch: Partial<PackageItinerary>) =>
    set('itinerary', (form.itinerary ?? []).map((d, idx) => idx === i ? { ...d, ...patch } : d));

  const removeDay = (i: number) =>
    set('itinerary', (form.itinerary ?? [])
      .filter((_, idx) => idx !== i)
      .map((d, idx) => ({ ...d, day: idx + 1 })));

  // ── Destination picker ───────────────────────────────────────────────────
  const openPicker = async (dayIndex: number) => {
    setPicker({ open: true, dayIndex });
    setPickerSearch('');
    setPickerError(null);
    if (destinations.length === 0) {
      setLoadingPicker(true);
      try {
        const data = await apiRequest('/destinations');
        const list = data as { id: string; name: string }[];
        setDestinations(Array.isArray(list) ? list : ((data as { data?: typeof list }).data ?? []));
      } catch {
        setPickerError(`Could not load destinations — check NEXT_PUBLIC_API_URL in your .env (${API_URL})`);
      } finally {
        setLoadingPicker(false);
      }
    }
  };

  const closePicker = () => setPicker({ open: false, dayIndex: 0 });

  const selectItem = (item: { id: string; name: string }) => {
    const { dayIndex } = picker;
    const day = (form.itinerary ?? [])[dayIndex];
    if (day?.attractions.some((a) => a.id === item.id)) { closePicker(); return; }
    set('itinerary', (form.itinerary ?? []).map((d, i) =>
      i === dayIndex
        ? { ...d, attractions: [...d.attractions, { id: item.id, label: item.name, tag: 'destination' as const }] }
        : d
    ));
    closePicker();
  };

  const removeAttraction = (dayIndex: number, attrIndex: number) =>
    set('itinerary', (form.itinerary ?? []).map((d, i) =>
      i === dayIndex ? { ...d, attractions: d.attractions.filter((_, j) => j !== attrIndex) } : d
    ));

  // ── Inclusions helpers ───────────────────────────────────────────────────
  const addInclusion = () =>
    set('inclusions', [...(form.inclusions ?? []), { type: 'MEAL', description: '' }]);

  const updateInclusion = (i: number, patch: Partial<PackageInclusion>) =>
    set('inclusions', (form.inclusions ?? []).map((inc, idx) => idx === i ? { ...inc, ...patch } : inc));

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const itinerary = (form.itinerary ?? []).map((d, i) => ({
      ...d,
      ...(i === 0                              ? { airportPickup }  : {}),
      ...(i === (form.itinerary?.length ?? 0) - 1 ? { airportDropoff } : {}),
    }));
    mutation.mutate(
      { id: packageId, data: { ...form, itinerary } },
      { onSuccess: () => router.push(backHref ?? '/admin/packages') },
    );
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div className="space-y-6">
      <FormStepper steps={STEPS} current={step} onStepClick={(i) => i < step && setStep(i)} />

      {/* ── Step 0 — Basic Info ─────────────────────────────────── */}
      {step === 0 && (
        <StepCard>
          <div>
            <FieldLabel htmlFor="edit-name">Name *</FieldLabel>
            <Input id="edit-name" value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} />
          </div>

          <div>
            <FieldLabel htmlFor="edit-category">Category *</FieldLabel>
            <StyledSelect id="edit-category" value={form.category ?? 'ADVENTURE'} onChange={(e) => set('category', e.target.value as CreatePackageInput['category'])}>
              {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </StyledSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Duration */}
            <div>
              <FieldLabel>Duration (days)</FieldLabel>
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
                {[1, 2, 3, 4, 5, 7, 10, 14, 30].map((n) => (
                  <button key={n} type="button" onClick={() => set('duration', n)}
                    className={['flex flex-col items-center px-2.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer min-w-[44px] flex-shrink-0',
                      form.duration === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'].join(' ')}>
                    <span className="text-base font-bold leading-tight">{n}</span>
                    <span className={['text-[10px] mt-0.5', form.duration === n ? 'text-gray-300' : 'text-gray-400'].join(' ')}>{n === 1 ? 'day' : 'days'}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => set('duration', Math.max(1, (form.duration ?? 1) - 1))} className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 select-none">−</button>
                <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-base">🗓️</span>
                  <span className="text-lg font-bold text-gray-900">{form.duration ?? 1}</span>
                  <span className="text-xs text-gray-400">{(form.duration ?? 1) === 1 ? 'day' : 'days'}</span>
                </div>
                <button type="button" onClick={() => set('duration', (form.duration ?? 1) + 1)} className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 select-none">＋</button>
              </div>
            </div>
            <PriceInput id="edit-price" label="Base Price (USD)" hint="Enter amount in USD" value={form.basePrice ?? 0} onChange={(v) => set('basePrice', v)} />
          </div>

          <div>
            <FieldLabel htmlFor="edit-status">Status</FieldLabel>
            <StyledSelect id="edit-status" value={form.status ?? 'DRAFT'} onChange={(e) => set('status', e.target.value as CreatePackageInput['status'])}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </StyledSelect>
          </div>

          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-amber-100 bg-amber-50">
            <div className="flex items-center gap-2">
              <span className="text-base">⭐</span>
              <div>
                <p className="text-xs font-semibold text-amber-800">Featured Package</p>
                <p className="text-[11px] text-amber-500">Show this package in the featured section</p>
              </div>
            </div>
            <button type="button" onClick={() => set('featured', !(form.featured ?? false))}
              className={['relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer', form.featured ? 'bg-amber-500' : 'bg-gray-200'].join(' ')}>
              <span className={['pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform', form.featured ? 'translate-x-4' : 'translate-x-0'].join(' ')} />
            </button>
          </div>
        </StepCard>
      )}

      {/* ── Step 1 — Details ─────────────────────────────────────── */}
      {step === 1 && (
        <StepCard>
          <div>
            <FieldLabel htmlFor="edit-desc">Description *</FieldLabel>
            <Textarea id="edit-desc" rows={4} placeholder="Describe what makes this package special…" value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Best Season */}
            <div>
              <label className="text-sm font-medium text-gray-700">Best Season</label>
              <p className="text-xs text-gray-400 mb-2">Select the start and end month.</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">From</label>
                  <select value={seasonStart} onChange={(e) => { setSeasonStart(e.target.value); handleSeasonChange(e.target.value, seasonEnd); }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 bg-white">
                    <option value="">Start month</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex-shrink-0 mt-5 text-gray-400 font-medium text-sm">→</div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <select value={seasonEnd} onChange={(e) => { setSeasonEnd(e.target.value); handleSeasonChange(seasonStart, e.target.value); }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 bg-white">
                    <option value="">End month</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              {form.bestSeason && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  🌤️ {form.bestSeason}
                </div>
              )}
            </div>

            {/* Max Capacity */}
            <div>
              <label className="text-sm font-medium text-gray-700">Max Capacity</label>
              <p className="text-xs text-gray-400 mb-3">Choose a group size or use − / + for exact.</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {[2, 4, 6, 8, 10, 15, 20, 30, 50].map((n) => (
                  <button key={n} type="button" onClick={() => set('maxCapacity', n)}
                    className={['px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer',
                      form.maxCapacity === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'].join(' ')}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => set('maxCapacity', Math.max(1, (form.maxCapacity ?? 1) - 1))} className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 select-none">−</button>
                <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-base">👥</span>
                  <span className="text-lg font-bold text-gray-900">{form.maxCapacity ?? 1}</span>
                  <span className="text-xs text-gray-400">{(form.maxCapacity ?? 1) === 1 ? 'person' : 'people'}</span>
                </div>
                <button type="button" onClick={() => set('maxCapacity', (form.maxCapacity ?? 1) + 1)} className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 select-none">＋</button>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <FieldLabel hint="Press Enter or click Add after each highlight">Highlights</FieldLabel>
            <div className="flex gap-2">
              <Input placeholder="e.g. UNESCO World Heritage Site visit" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && highlightInput.trim()) { e.preventDefault(); set('highlights', [...(form.highlights ?? []), highlightInput.trim()]); setHighlightInput(''); } }} />
              <Button type="button" variant="outline" onClick={() => { if (highlightInput.trim()) { set('highlights', [...(form.highlights ?? []), highlightInput.trim()]); setHighlightInput(''); } }}>Add</Button>
            </div>
            {(form.highlights ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(form.highlights ?? []).map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-full px-2.5 py-0.5 text-xs">
                    {h}
                    <button type="button" onClick={() => set('highlights', (form.highlights ?? []).filter((_, idx) => idx !== i))} className="text-teal-500 hover:text-red-500 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-5">
            <ImageUploadField label="Package Images" hint="Upload or link photos for this package." multiple values={form.images ?? []} onChangeMultiple={(urls) => set('images', urls)} />
          </div>
        </StepCard>
      )}

      {/* ── Step 2 — Itinerary ───────────────────────────────────── */}
      {step === 2 && (
        <StepCard>
          {(form.itinerary ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No days added yet. Click below to start building the itinerary.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(form.itinerary ?? []).map((day, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Day {day.day}</span>
                    <button type="button" onClick={() => removeDay(i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                  </div>
                  <Input placeholder="Day title e.g. Arrival in Colombo" value={day.title} onChange={(e) => updateDay(i, { title: e.target.value })} />
                  <Textarea placeholder="What happens this day…" rows={2} value={day.description} onChange={(e) => updateDay(i, { description: e.target.value })} />

                  {i === 0 && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-blue-100 bg-blue-50">
                      <div className="flex items-center gap-2">
                        <span className="text-base">✈️</span>
                        <div>
                          <p className="text-xs font-semibold text-blue-800">Airport Pickup</p>
                          <p className="text-[11px] text-blue-500">Pick up guests from the airport on Day 1</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setAirportPickup((v) => !v)}
                        className={['relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer', airportPickup ? 'bg-blue-500' : 'bg-gray-200'].join(' ')}>
                        <span className={['pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform', airportPickup ? 'translate-x-4' : 'translate-x-0'].join(' ')} />
                      </button>
                    </div>
                  )}
                  {i === (form.itinerary?.length ?? 0) - 1 && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-purple-100 bg-purple-50">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🛫</span>
                        <div>
                          <p className="text-xs font-semibold text-purple-800">Airport Drop-off</p>
                          <p className="text-[11px] text-purple-500">Drop off guests at the airport on the last day</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setAirportDropoff((v) => !v)}
                        className={['relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer', airportDropoff ? 'bg-purple-500' : 'bg-gray-200'].join(' ')}>
                        <span className={['pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform', airportDropoff ? 'translate-x-4' : 'translate-x-0'].join(' ')} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 mt-1">
                    <button type="button" onClick={() => openPicker(i)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                      🗺️ + Destination
                    </button>
                  </div>

                  {day.attractions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {day.attractions.map((attr, attrIdx) => (
                        <span key={attrIdx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                          📍 {attr.label}
                          <button type="button" onClick={() => removeAttraction(i, attrIdx)} className="ml-0.5 text-gray-400 hover:text-red-500 font-bold text-xs leading-none bg-transparent border-none cursor-pointer">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Button type="button" variant="outline" onClick={addItineraryDay} className="w-full">+ Add Day</Button>
        </StepCard>
      )}

      {/* ── Step 3 — Inclusions ──────────────────────────────────── */}
      {step === 3 && (
        <StepCard>
          {(form.inclusions ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No inclusions yet. Click below to add meals, transport, and more.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(form.inclusions ?? []).map((inc, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select value={inc.type} onChange={(e) => updateInclusion(i, { type: e.target.value as PackageInclusion['type'] })}
                    className="shrink-0 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                    <option value="MEAL">Meal</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="ACCOMMODATION">Accommodation</option>
                    <option value="ACTIVITY">Activity</option>
                  </select>
                  <Input className="flex-1" placeholder="Description" value={inc.description} onChange={(e) => updateInclusion(i, { description: e.target.value })} />
                  <button type="button" onClick={() => set('inclusions', (form.inclusions ?? []).filter((_, idx) => idx !== i))}
                    className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Remove inclusion">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <Button type="button" variant="outline" onClick={addInclusion} className="w-full">+ Add Inclusion</Button>
        </StepCard>
      )}

      {/* ── Destination Picker Modal ─────────────────────────────── */}
      {picker.open && (() => {
        const filtered = destinations.filter((item) => item.name.toLowerCase().includes(pickerSearch.toLowerCase()));
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closePicker}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden flex flex-col" style={{ maxHeight: '80vh' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-emerald-50">🗺️</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Day {picker.dayIndex + 1}</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Select a Destination</p>
                  </div>
                </div>
                <button onClick={closePicker} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-lg font-bold leading-none transition-colors">×</button>
              </div>
              <div className="px-4 py-3 border-b border-gray-50 flex-shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
                  <input autoFocus type="text" value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} placeholder="Search destinations…"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-50 transition-colors" />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-2">
                {loadingPicker && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                    <p className="text-xs">Loading…</p>
                  </div>
                )}
                {!loadingPicker && pickerError && (
                  <div className="mx-2 my-3 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-xs text-red-600 font-medium">⚠️ {pickerError}</p>
                  </div>
                )}
                {!loadingPicker && !pickerError && filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <span className="text-3xl opacity-30">🗺️</span>
                    <p className="text-sm text-gray-400 text-center px-6">{pickerSearch ? `No results for "${pickerSearch}"` : 'No destinations available'}</p>
                  </div>
                )}
                {!loadingPicker && !pickerError && filtered.map((item) => {
                  const day = (form.itinerary ?? [])[picker.dayIndex];
                  const alreadyAdded = day?.attractions.some((a) => a.id === item.id);
                  return (
                    <button key={item.id} type="button" onClick={() => !alreadyAdded && selectItem(item)} disabled={alreadyAdded}
                      className={['w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                        alreadyAdded ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'].join(' ')}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm flex-shrink-0">📍</span>
                        <span className="font-medium text-gray-800 truncate">{item.name}</span>
                      </div>
                      {alreadyAdded
                        ? <span className="flex-shrink-0 text-xs font-semibold text-emerald-500">✓</span>
                        : <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold bg-emerald-100 text-emerald-700">+</span>}
                    </button>
                  );
                })}
              </div>
              {!loadingPicker && !pickerError && filtered.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0 bg-gray-50">
                  <p className="text-xs text-gray-400 text-center">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} available</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-8">
        <Button variant="secondary" onClick={() => (step === 0 ? router.push(backHref ?? '/admin/packages') : setStep((s) => s - 1))}>
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>
        {isLast ? (
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        ) : (
          <Button onClick={() => setStep((s) => s + 1)}>Next →</Button>
        )}
      </div>
    </div>
  );
}
