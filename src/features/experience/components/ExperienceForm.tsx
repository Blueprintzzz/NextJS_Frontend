'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStepper } from '@/components/shared/FormStepper';
import { ImageUploadField } from '@/components/shared/ImageUploadField';
import { PriceInput } from '@/components/shared/PriceInput';
import { API_URL } from '@/lib/api/config';
import { useCreateExperience, useUpdateExperience, useExperienceById } from '../hooks/useExperience';
import type { CreateExperienceInput } from '../api/experience.api';

// ─── Steps definition ─────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Basic Info',    description: 'Name, category' },
  { label: 'Media',         description: 'Photos' },
  { label: 'Location',      description: 'Where it happens' },
  { label: 'Pricing',       description: 'Price, duration & visibility' },
];

// ─── Static data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'ADVENTURE',  label: 'Adventure' },
  { value: 'NATURE',     label: 'Nature & Wildlife' },
  { value: 'CULTURAL',   label: 'Cultural' },
  { value: 'RELAXATION', label: 'Relaxation & Spa' },
  { value: 'FAMILY',     label: 'Family-Friendly' },
  { value: 'ROMANTIC',   label: 'Romantic Escapes' },
];

const EMPTY: CreateExperienceInput = {
  name: '', description: '', category: 'ADVENTURE',
  price: 0, duration: '', image: '', images: [],
  location: '', destinationId: '', featured: false, status: 'ACTIVE',
  capacity: undefined, availability: '',
};

interface District { id: string; name: string; }
interface Props { experienceId?: string; redirectTo?: string; }

// ─── Shared field helpers ─────────────────────────────────────────────────────
function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  // Render "Label *" with the asterisk in red
  const label = typeof children === 'string' && children.endsWith(' *')
    ? <>{children.slice(0, -2)} <span className="text-red-500">*</span></>
    : children;

  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{label}</label>
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

// ─── Step card wrapper ────────────────────────────────────────────────────────
function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-6 py-6 space-y-5">
      {children}
    </div>
  );
}

// ─── Per-step validation ──────────────────────────────────────────────────────
type StepErrors = Partial<Record<keyof CreateExperienceInput, string>>;

function validateStep(step: number, form: CreateExperienceInput): StepErrors {
  const errors: StepErrors = {};
  if (step === 0) {
    if (!form.name.trim())        errors.name        = 'Name is required.';
    if (!form.description.trim()) errors.description = 'Description is required.';
  }
  if (step === 3) {
    if (!form.price || Number(form.price) <= 0) errors.price    = 'Enter a price greater than 0.';
    if (!form.duration.trim())                  errors.duration = 'Duration is required.';
  }
  return errors;
}

// ─── District searchable combobox ────────────────────────────────────────────
function DistrictSearch({ districts, value, onChange }: {
  districts: District[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);

  const selected = districts.find(d => d.id === value);
  const filtered = query.trim()
    ? districts.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
    : districts;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 cursor-pointer focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500"
        onClick={() => setOpen(v => !v)}
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? selected.name : '— None —'}
        </span>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search district…"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400"
              onClick={e => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            <li
              className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
              onClick={() => { onChange(''); setQuery(''); setOpen(false); }}
            >
              — None —
            </li>
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400">No results</li>
            ) : filtered.map(d => (
              <li
                key={d.id}
                onClick={() => { onChange(d.id); setQuery(''); setOpen(false); }}
                className={['px-3 py-2 text-sm cursor-pointer transition-colors', d.id === value ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-800 hover:bg-gray-50'].join(' ')}
              >
                {d.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function ExperienceForm({ experienceId, redirectTo = '/admin/experiences' }: Props) {
  const router  = useRouter();
  const isEdit  = !!experienceId;

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const effectiveRedirect = returnTo ?? redirectTo;

  const { data: existing, isLoading: loadingExisting } = useExperienceById(experienceId ?? null);
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();

  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState<CreateExperienceInput>(EMPTY);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/destinations?limit=200`)
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((d) => {
        const list: { id: string; name: string }[] = Array.isArray(d) ? d : (d?.data ?? []);
        setDistricts(list.map((item) => ({ id: item.id, name: item.name })).sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (existing) {
      setForm({
        name:         existing.name,
        description:  existing.description,
        category:     existing.category,
        price:        Number(existing.price),
        duration:     existing.duration,
        image:        existing.image ?? '',
        images:       Array.isArray(existing.images) ? existing.images as string[] : [],
        location:     existing.location ?? '',
        destinationId:   existing.destinationId ?? '',
        featured:     existing.featured,
        status:       existing.status,
        capacity:     existing.capacity ?? undefined,
        availability: existing.availability ?? '',
      });
    }
  }, [existing]);

  if (isEdit && loadingExisting) return <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />;
  if (isEdit && !existing)       return <p className="text-sm text-red-600">Experience not found.</p>;

  const set = <K extends keyof CreateExperienceInput>(k: K, v: CreateExperienceInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const payload: Omit<CreateExperienceInput, 'capacity' | 'availability' | 'destinationId'> & { destinationId?: string } = {
      name:         form.name,
      description:  form.description,
      category:     form.category,
      price:        Number(form.price),
      duration:     form.duration,
      images:       form.images?.filter(Boolean) ?? [],
      featured:     form.featured,
      status:       form.status,
      ...(form.image        && { image: form.image }),
      ...(form.location     && { location: form.location }),
      ...(form.destinationId && { destinationId: form.destinationId }),
    };
    if (isEdit) {
      updateMutation.mutate({ id: experienceId!, data: payload }, { onSuccess: () => router.push(effectiveRedirect) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => router.push(effectiveRedirect) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isLast    = step === STEPS.length - 1;

  const tryNext = () => {
    const errors = validateStep(step, form);
    setStepErrors(errors);
    if (Object.keys(errors).length === 0) {
      setStep((s) => s + 1);
    }
  };

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
            <FieldLabel htmlFor="exp-name">Name *</FieldLabel>
            <Input
              id="exp-name"
              placeholder="e.g. Sunrise Hike at Ella Rock"
              value={form.name}
              onChange={(e) => { set('name', e.target.value); setStepErrors((p) => ({ ...p, name: undefined })); }}
            />
            {stepErrors.name && <p className="text-xs text-red-500 mt-1">{stepErrors.name}</p>}
          </div>

          <div>
            <FieldLabel htmlFor="exp-desc">Description *</FieldLabel>
            <Textarea
              id="exp-desc"
              rows={4}
              placeholder="Describe the experience in detail…"
              value={form.description}
              onChange={(e) => { set('description', e.target.value); setStepErrors((p) => ({ ...p, description: undefined })); }}
            />
            {stepErrors.description && <p className="text-xs text-red-500 mt-1">{stepErrors.description}</p>}
          </div>

          <div>
            <FieldLabel htmlFor="exp-category">Category *</FieldLabel>
            <StyledSelect
              id="exp-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </StyledSelect>
          </div>
        </StepCard>
      )}

      {/* ── Step 1 — Media ───────────────────────────────────────── */}
      {step === 1 && (
        <StepCard>
          <ImageUploadField
            label="Main Image"
            hint="The primary photo shown on the experience card."
            value={form.image ?? ''}
            onChange={(url) => set('image', url)}
          />

          <div className="border-t border-gray-100 pt-5">
            <ImageUploadField
              label="Additional Images"
              hint="Add a gallery of supporting photos. Upload files or paste URLs."
              multiple
              values={form.images ?? []}
              onChangeMultiple={(urls) => set('images', urls)}
            />
          </div>
        </StepCard>
      )}

      {/* ── Step 2 — Location ────────────────────────────────────── */}
      {step === 2 && (
        <StepCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="exp-location">Location</FieldLabel>
              <Input
                id="exp-location"
                placeholder="e.g. Sigiriya"
                value={form.location ?? ''}
                onChange={(e) => set('location', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="exp-district">Destination</FieldLabel>
              <DistrictSearch
                districts={districts}
                value={form.destinationId ?? ''}
                onChange={(id) => set('destinationId', id)}
              />
            </div>
          </div>
        </StepCard>
      )}

      {/* ── Step 3 — Pricing & Visibility ────────────────────────── */}
      {step === 3 && (
        <StepCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <PriceInput
                id="exp-price"
                label="Price (USD) *"
                hint="Enter amount in USD"
                value={form.price}
                onChange={(v) => { set('price', v); setStepErrors((p) => ({ ...p, price: undefined })); }}
                error={stepErrors.price}
              />
            </div>
            <div>
              <FieldLabel htmlFor="exp-duration" hint='e.g. "3 hours", "Full day"'>Duration *</FieldLabel>
              <Input
                id="exp-duration"
                placeholder='e.g. "3 hours"'
                value={form.duration}
                onChange={(e) => { set('duration', e.target.value); setStepErrors((p) => ({ ...p, duration: undefined })); }}
              />
              {stepErrors.duration && <p className="text-xs text-red-500 mt-1">{stepErrors.duration}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            <div>
              <FieldLabel htmlFor="exp-capacity" hint="Max number of participants">Capacity</FieldLabel>
              <Input
                id="exp-capacity"
                type="number"
                min={1}
                placeholder="e.g. 10"
                value={form.capacity ?? ''}
                onChange={(e) => set('capacity', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="exp-availability" hint='e.g. "Daily", "Weekends only"'>Availability</FieldLabel>
              <Input
                id="exp-availability"
                placeholder='e.g. "Daily 8am–5pm"'
                value={form.availability ?? ''}
                onChange={(e) => set('availability', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            <div>
              <FieldLabel htmlFor="exp-status">Status</FieldLabel>
              <StyledSelect
                id="exp-status"
                value={form.status ?? 'ACTIVE'}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </StyledSelect>
            </div>
            <div className="flex items-start gap-3 pt-6">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured ?? false}
                onChange={(e) => set('featured', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-teal-600"
              />
              <div>
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured</label>
                <p className="text-xs text-gray-400">Show on the homepage featured section</p>
              </div>
            </div>
          </div>
        </StepCard>
      )}

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-8">
        <Button
          variant="secondary"
          onClick={() => {
            setStepErrors({});
            step === 0 ? router.back() : setStep((s) => s - 1);
          }}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>

        {isLast ? (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? (isEdit ? 'Saving…' : 'Creating…')
              : (isEdit ? 'Save Changes' : 'Create Experience')}
          </Button>
        ) : (
          <Button onClick={tryNext}>
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
