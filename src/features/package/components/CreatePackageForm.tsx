'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStepper } from '@/components/shared/FormStepper';
import { ImageUploadField } from '@/components/shared/ImageUploadField';
import { PriceInput } from '@/components/shared/PriceInput';
import { useCreatePackage } from '../hooks/usePackages';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../utils/package.utils';
import { apiRequest } from '@/lib/api';
import { API_URL } from '@/lib/api/config';
import type { CreatePackageInput, PackageItinerary, PackageInclusion } from '../types/package.types';

// ─── Steps definition ─────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Basic Info',  description: 'Name, category, price' },
  { label: 'Details',     description: 'Description & highlights' },
  { label: 'Itinerary',   description: 'Day-by-day plan' },
  { label: 'Inclusions',  description: 'Meals, transport, etc.' },
];

const EMPTY: CreatePackageInput = {
  name: '', description: '', category: 'ADVENTURE', duration: 1, basePrice: 0,
  highlights: [], bestSeason: '', maxCapacity: 10, images: [],
  itinerary: [], inclusions: [], status: 'DRAFT',
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
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
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
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

// ─── Main form ────────────────────────────────────────────────────────────────
export function CreatePackageForm() {
  const router   = useRouter();
  const mutation = useCreatePackage();

  const [step, setStep]                   = useState(0);
  const [form, setForm]                   = useState<CreatePackageInput>(EMPTY);
  const [highlightInput, setHighlightInput] = useState('');

  // ── Best Season month picker state ───────────────────────────────────────
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const parseSeason = (season: string) => {
    const parts = season.split('–').map((s) => s.trim());
    return { start: parts[0] ?? '', end: parts[1] ?? '' };
  };

  const [seasonStart, setSeasonStart] = useState(() => parseSeason(form.bestSeason).start);
  const [seasonEnd,   setSeasonEnd]   = useState(() => parseSeason(form.bestSeason).end);

  const handleSeasonChange = (start: string, end: string) => {
    if (start && end) {
      set('bestSeason', `${start} – ${end}`);
    } else if (start) {
      set('bestSeason', start);
    } else {
      set('bestSeason', '');
    }
  };

  // ── Picker modal state ───────────────────────────────────────────────────
  const [picker, setPicker] = useState<{
    open: boolean;
    dayIndex: number;
    tag: 'destination' | 'experience' | null;
  }>({ open: false, dayIndex: 0, tag: null });

  const [destinations,   setDestinations]  = useState<{ id: string; name: string }[]>([]);
  const [experiences,    setExperiences]   = useState<{ id: string; name: string; category?: string }[]>([]);
  const [pickerSearch,   setPickerSearch]  = useState('');
  const [loadingPicker,  setLoadingPicker] = useState(false);
  const [pickerError,    setPickerError]   = useState<string | null>(null);

  const set = <K extends keyof CreatePackageInput>(k: K, v: CreatePackageInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addItineraryDay = () => {
    set('itinerary', [
      ...form.itinerary,
      { day: form.itinerary.length + 1, title: '', description: '', attractions: [] },
    ]);
  };

  const updateDay = (i: number, patch: Partial<PackageItinerary>) =>
    set('itinerary', form.itinerary.map((d, idx) => idx === i ? { ...d, ...patch } : d));

  const removeDay = (i: number) => {
    set('itinerary', form.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })));
  };

  // ── Picker handlers ──────────────────────────────────────────────────────
  const openPicker = async (dayIndex: number, tag: 'destination' | 'experience') => {
    setPicker({ open: true, dayIndex, tag });
    setPickerSearch('');
    setPickerError(null);

    if (tag === 'destination' && destinations.length === 0) {
      setLoadingPicker(true);
      try {
        const data = await apiRequest('/districts');
        const list = data as { id: string; name: string }[];
        setDestinations(Array.isArray(list) ? list : ((data as { data?: typeof list }).data ?? []));
      } catch {
        setPickerError(`Could not load districts — check NEXT_PUBLIC_API_URL in your .env (${API_URL})`);
      } finally {
        setLoadingPicker(false);
      }
    }

    if (tag === 'experience' && experiences.length === 0) {
      setLoadingPicker(true);
      try {
        const data = await apiRequest('/experiences');
        const list = data as { id: string; name: string; category?: string }[];
        setExperiences(Array.isArray(list) ? list : ((data as { data?: typeof list }).data ?? []));
      } catch {
        setPickerError(`Could not load experiences — check NEXT_PUBLIC_API_URL in your .env (${API_URL})`);
      } finally {
        setLoadingPicker(false);
      }
    }
  };

  const closePicker = () => setPicker({ open: false, dayIndex: 0, tag: null });

  const selectItem = (item: { id: string; name: string }) => {
    const { dayIndex, tag } = picker;
    if (!tag) return;
    const day = form.itinerary[dayIndex];
    const alreadyAdded = day.attractions.some((a) => a.id === item.id && a.tag === tag);
    if (alreadyAdded) { closePicker(); return; }
    const updated = form.itinerary.map((d, i) =>
      i === dayIndex
        ? { ...d, attractions: [...d.attractions, { id: item.id, label: item.name, tag }] }
        : d
    );
    set('itinerary', updated);
    closePicker();
  };

  const removeAttraction = (dayIndex: number, attrIndex: number) => {
    const updated = form.itinerary.map((d, i) =>
      i === dayIndex
        ? { ...d, attractions: d.attractions.filter((_, j) => j !== attrIndex) }
        : d
    );
    set('itinerary', updated);
  };

  // ── Create-experience shortcut ───────────────────────────────────────────
  const goCreateExperience = () => {
    closePicker();
    router.push('/admin/experiences/create?returnTo=/packages/create');
  };

  // Clear experience cache on mount so newly created experiences appear
  // when the user navigates back from /admin/experiences/create
  useEffect(() => {
    setExperiences([]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addInclusion = () =>
    set('inclusions', [...form.inclusions, { type: 'MEAL', description: '' }]);

  const updateInclusion = (i: number, patch: Partial<PackageInclusion>) =>
    set('inclusions', form.inclusions.map((inc, idx) => idx === i ? { ...inc, ...patch } : inc));

  const handleSubmit = () => {
    mutation.mutate(form, { onSuccess: () => router.push('/packages') });
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div className="space-y-6">
      {/* ── Stepper ─────────────────────────────────────────────── */}
      <FormStepper
        steps={STEPS}
        current={step}
        onStepClick={(i) => i < step && setStep(i)}
      />

      {/* ── Step 0 — Basic Info ──────────────────────────────────── */}
      {step === 0 && (
        <StepCard>
          <div>
            <FieldLabel htmlFor="pkg-name">Name *</FieldLabel>
            <Input
              id="pkg-name"
              placeholder="e.g. 7-Day Sri Lanka Highlights"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="pkg-category">Category *</FieldLabel>
            <StyledSelect
              id="pkg-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value as CreatePackageInput['category'])}
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </StyledSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="pkg-duration">Duration (days)</FieldLabel>
              <Input
                id="pkg-duration"
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) => set('duration', Number(e.target.value))}
              />
            </div>
            <div>
              <PriceInput
                id="pkg-price"
                label="Base Price (USD)"
                hint="Enter amount in USD"
                value={form.basePrice}
                onChange={(v) => set('basePrice', v)}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="pkg-status">Status</FieldLabel>
            <StyledSelect
              id="pkg-status"
              value={form.status}
              onChange={(e) => set('status', e.target.value as CreatePackageInput['status'])}
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </StyledSelect>
          </div>
        </StepCard>
      )}

      {/* ── Step 1 — Details ─────────────────────────────────────── */}
      {step === 1 && (
        <StepCard>
          <div>
            <FieldLabel htmlFor="pkg-desc">Description *</FieldLabel>
            <Textarea
              id="pkg-desc"
              rows={4}
              placeholder="Describe what makes this package special…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Best Season — month range picker */}
            <div>
              <label className="text-sm font-medium text-gray-700">Best Season</label>
              <p className="text-xs text-gray-400 mb-2">Select the start and end month for the best visiting period.</p>
              <div className="flex items-center gap-3">
                {/* Start month */}
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">From</label>
                  <select
                    value={seasonStart}
                    onChange={(e) => {
                      setSeasonStart(e.target.value);
                      handleSeasonChange(e.target.value, seasonEnd);
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                  >
                    <option value="">Start month</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                {/* Arrow separator */}
                <div className="flex-shrink-0 mt-5 text-gray-400 font-medium text-sm">→</div>
                {/* End month */}
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <select
                    value={seasonEnd}
                    onChange={(e) => {
                      setSeasonEnd(e.target.value);
                      handleSeasonChange(seasonStart, e.target.value);
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                  >
                    <option value="">End month</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              {/* Live preview pill */}
              {form.bestSeason && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  🌤️ {form.bestSeason}
                </div>
              )}
            </div>

            {/* Max Capacity — visual selector */}
            <div>
              <label className="text-sm font-medium text-gray-700">Max Capacity</label>
              <p className="text-xs text-gray-400 mb-3">Choose a group size or use − / + to set an exact number.</p>
              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[2, 4, 6, 8, 10, 15, 20, 30, 50].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('maxCapacity', n)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer',
                      form.maxCapacity === n
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
                    ].join(' ')}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {/* Stepper row */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set('maxCapacity', Math.max(1, form.maxCapacity - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 select-none"
                >
                  −
                </button>
                <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-base">👥</span>
                  <span className="text-lg font-bold text-gray-900">{form.maxCapacity}</span>
                  <span className="text-xs text-gray-400">{form.maxCapacity === 1 ? 'person' : 'people'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => set('maxCapacity', form.maxCapacity + 1)}
                  className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 select-none"
                >
                  ＋
                </button>
              </div>
              {/* Size hint */}
              <p className="text-xs text-gray-400 mt-2">
                {form.maxCapacity <= 2                                    && '👫 Couple / private tour'}
                {form.maxCapacity >= 3  && form.maxCapacity <= 6          && '👨‍👩‍👧‍👦 Small group'}
                {form.maxCapacity >= 7  && form.maxCapacity <= 15         && '🧑‍🤝‍🧑 Medium group'}
                {form.maxCapacity >= 16 && form.maxCapacity <= 30         && '👥 Large group'}
                {form.maxCapacity > 30                                    && '🚌 Bus group'}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <FieldLabel hint="Press Enter or click Add after each highlight">Highlights</FieldLabel>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. UNESCO World Heritage Site visit"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && highlightInput.trim()) {
                    e.preventDefault();
                    set('highlights', [...form.highlights, highlightInput.trim()]);
                    setHighlightInput('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (highlightInput.trim()) {
                    set('highlights', [...form.highlights, highlightInput.trim()]);
                    setHighlightInput('');
                  }
                }}
              >
                Add
              </Button>
            </div>
            {form.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.highlights.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-800 rounded-full px-2.5 py-0.5 text-xs">
                    {h}
                    <button
                      type="button"
                      onClick={() => set('highlights', form.highlights.filter((_, idx) => idx !== i))}
                      className="text-green-500 hover:text-red-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="border-t border-gray-100 pt-5">
            <ImageUploadField
              label="Package Images"
              hint="Upload or link photos for this package."
              multiple
              values={form.images}
              onChangeMultiple={(urls) => set('images', urls)}
            />
          </div>
        </StepCard>
      )}

      {/* ── Step 2 — Itinerary ───────────────────────────────────── */}
      {step === 2 && (
        <StepCard>
          {form.itinerary.length === 0 ? (
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
              {form.itinerary.map((day, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Day {day.day}</span>
                      <button
                        type="button"
                        onClick={() => removeDay(i)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <Input
                      placeholder="Day title e.g. Arrival in Colombo"
                      value={day.title}
                      onChange={(e) => updateDay(i, { title: e.target.value })}
                    />
                    <Textarea
                      placeholder="What happens this day…"
                      rows={2}
                      value={day.description}
                      onChange={(e) => updateDay(i, { description: e.target.value })}
                    />

                    {/* ── Picker buttons ── */}
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => openPicker(i, 'destination')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        🗺️ + Destination
                      </button>
                      <button
                        type="button"
                        onClick={() => openPicker(i, 'experience')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-colors"
                      >
                        ✨ + Experience
                      </button>
                    </div>

                    {/* ── Selected attraction pills ── */}
                    {day.attractions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {day.attractions.map((attr, attrIdx) => (
                          <span
                            key={attrIdx}
                            className={[
                              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                              attr.tag === 'destination'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-violet-50  text-violet-700  border-violet-200',
                            ].join(' ')}
                          >
                            {attr.tag === 'destination' ? '📍' : '🎯'}
                            {attr.label}
                            <button
                              type="button"
                              onClick={() => removeAttraction(i, attrIdx)}
                              className="ml-0.5 text-gray-400 hover:text-red-500 font-bold text-xs leading-none bg-transparent border-none cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          <Button type="button" variant="outline" onClick={addItineraryDay} className="w-full">
            + Add Day
          </Button>
        </StepCard>
      )}

      {/* ── Step 3 — Inclusions ──────────────────────────────────── */}
      {step === 3 && (
        <StepCard>
          {form.inclusions.length === 0 ? (
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
              {form.inclusions.map((inc, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={inc.type}
                    onChange={(e) => updateInclusion(i, { type: e.target.value as PackageInclusion['type'] })}
                    className="shrink-0 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="MEAL">Meal</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="ACCOMMODATION">Accommodation</option>
                    <option value="ACTIVITY">Activity</option>
                  </select>
                  <Input
                    className="flex-1"
                    placeholder="Description"
                    value={inc.description}
                    onChange={(e) => updateInclusion(i, { description: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => set('inclusions', form.inclusions.filter((_, idx) => idx !== i))}
                    className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove inclusion"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button type="button" variant="outline" onClick={addInclusion} className="w-full">
            + Add Inclusion
          </Button>
        </StepCard>
      )}

      {/* ── Picker Modal ─────────────────────────────────────────── */}
      {picker.open && (() => {
        const isDestination = picker.tag === 'destination';
        const rawList = isDestination ? destinations : experiences;
        const filtered = rawList.filter((item) =>
          item.name.toLowerCase().includes(pickerSearch.toLowerCase())
        );
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closePicker}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden flex flex-col"
              style={{ maxHeight: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className={[
                    'w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
                    isDestination ? 'bg-emerald-50' : 'bg-violet-50',
                  ].join(' ')}>
                    {isDestination ? '🗺️' : '✨'}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Day {picker.dayIndex + 1}
                    </p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                      {isDestination ? 'Select a Destination' : 'Select an Experience'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closePicker}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-lg font-bold leading-none transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Search */}
              <div className="px-4 py-3 border-b border-gray-50 flex-shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                    🔍
                  </span>
                  <input
                    autoFocus
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder={isDestination ? 'Search districts…' : 'Search experiences…'}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors"
                  />
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 p-2">
                {/* Loading */}
                {loadingPicker && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-xs">Loading from …</p>
                  </div>
                )}

                {/* Error */}
                {!loadingPicker && pickerError && (
                  <div className="mx-2 my-3 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-xs text-red-600 font-medium">⚠️ {pickerError}</p>
                    <p className="text-xs text-red-400 mt-1">
                      Current NEXT_PUBLIC_API_URL: {API_URL}
                    </p>
                  </div>
                )}

                {/* Empty */}
                {!loadingPicker && !pickerError && filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <span className="text-3xl opacity-30">{isDestination ? '🗺️' : '✨'}</span>
                    <p className="text-sm text-gray-400 text-center px-6">
                      {pickerSearch
                        ? `No results for "${pickerSearch}"`
                        : isDestination
                          ? 'No districts returned from the API'
                          : 'No experiences returned from the API'}
                    </p>
                  </div>
                )}

                {/* Items */}
                {!loadingPicker && !pickerError && filtered.map((item) => {
                  const day = form.itinerary[picker.dayIndex];
                  const alreadyAdded = day?.attractions.some(
                    (a) => a.id === item.id && a.tag === picker.tag
                  );
                  const category = (item as { category?: string }).category;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => !alreadyAdded && selectItem(item)}
                      disabled={alreadyAdded}
                      className={[
                        'w-full text-left flex items-center justify-between gap-3',
                        'px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                        alreadyAdded
                          ? 'opacity-40 cursor-not-allowed bg-gray-50'
                          : 'hover:bg-gray-50 cursor-pointer',
                      ].join(' ')}
                    >
                      {/* Left: name + category badge */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm flex-shrink-0">
                          {isDestination ? '📍' : '🎯'}
                        </span>
                        <span className="font-medium text-gray-800 truncate">{item.name}</span>
                        {category && (
                          <span className={[
                            'flex-shrink-0 text-xs px-1.5 py-0.5 rounded-md font-medium',
                            isDestination
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-violet-50 text-violet-600',
                          ].join(' ')}>
                            {category}
                          </span>
                        )}
                      </div>

                      {/* Right: added check or + */}
                      {alreadyAdded ? (
                        <span className="flex-shrink-0 text-xs font-semibold text-emerald-500">✓</span>
                      ) : (
                        <span className={[
                          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                          'text-sm font-bold transition-colors',
                          isDestination
                            ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                            : 'bg-violet-100 text-violet-700 group-hover:bg-violet-200',
                        ].join(' ')}>
                          +
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Create new experience shortcut — only shown in experience picker */}
                {!isDestination && (
                  <div className="sticky bottom-0 pt-2 mt-1 border-t border-gray-100 bg-white">
                    <button
                      type="button"
                      onClick={goCreateExperience}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors cursor-pointer"
                    >
                      <span className="text-base">＋</span>
                      Create New Experience
                      <span className="text-xs font-normal text-violet-500 ml-1">→ comes back here</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!loadingPicker && !pickerError && filtered.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0 bg-gray-50">
                  <p className="text-xs text-gray-400 text-center">
                    {filtered.length}{' '}
                    {isDestination ? 'district' : 'experience'}
                    {filtered.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-8">
        <Button
          variant="secondary"
          onClick={() => (step === 0 ? router.back() : setStep((s) => s - 1))}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>

        {isLast ? (
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create Package'}
          </Button>
        ) : (
          <Button onClick={() => setStep((s) => s + 1)}>
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
