'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStepper } from '@/components/shared/FormStepper';
import { ImageUploadField } from '@/components/shared/ImageUploadField';
import { useCreateDestination } from '../hooks/useDestination';
import type { DestinationCategory } from '../types/destination.types';
import { MapboxMap } from '@/components/shared/MapboxMapDynamic';
import { Search } from 'lucide-react';
import { searchPlaces, reverseGeocode } from '@/lib/geocoding';
import type { GeoSuggestion } from '@/lib/geocoding';

const STEPS = [
  { label: 'Basic Info',   description: 'Name, category, status' },
  { label: 'Location',     description: 'Coordinates & visit info' },
  { label: 'Weather',      description: 'Climate details' },
  { label: 'Images',       description: 'Cover & gallery' },
];

const CATEGORIES: DestinationCategory[] = [
  'TEMPLE', 'BEACH', 'MOUNTAIN', 'WATERFALL', 'HISTORIC', 'WILDLIFE', 'CITY', 'NATURE',
];

const EMPTY = {
  name: '', description: '', category: 'NATURE' as DestinationCategory,
  status: 'ACTIVE', featured: false,
  latitude: '', longitude: '', district: '',
  bestVisitingSeason: '', estimatedVisitingTime: '', openingHours: '', entryFee: '',
  travelTips: '',
  temperature: '', humidity: '', rainfall: '', condition: '', climate: '',
  coverImage: '', images: [] as string[],
};

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

export function CreateDestinationForm() {
  const router   = useRouter();
  const mutation = useCreateDestination();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = async (value: string) => {
    const results = await searchPlaces(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  };

  const handleNameChange = (value: string) => {
    set('name', value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSearchClick = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (form.name.trim().length >= 2) fetchSuggestions(form.name.trim());
  };

  const reverseGeocodeDistrict = async (lat: number, lng: number) => {
    setDistrictLoading(true);
    const { district } = await reverseGeocode(lat, lng);
    setForm((f) => ({ ...f, district }));
    setDistrictLoading(false);
  };

  const handleSelectSuggestion = (s: GeoSuggestion) => {
    const [lng, lat] = s.center;
    const shortName = s.place_name.split(',')[0].trim();
    setForm((f) => ({ ...f, name: shortName, latitude: String(lat), longitude: String(lng) }));
    setSuggestions([]);
    setShowSuggestions(false);
    reverseGeocodeDistrict(lat, lng);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.latitude || isNaN(Number(form.latitude))) newErrors.latitude = 'Valid latitude is required';
    if (!form.longitude || isNaN(Number(form.longitude))) newErrors.longitude = 'Valid longitude is required';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      // Jump to the first step that has an error
      if (newErrors.name || newErrors.description) { setStep(0); }
      else if (newErrors.latitude || newErrors.longitude) { setStep(1); }
      return;
    }
    setErrors({});
    const weatherInfo = {
      temperature: form.temperature || undefined,
      humidity:    form.humidity    || undefined,
      rainfall:    form.rainfall    || undefined,
      condition:   form.condition   || undefined,
      climate:     form.climate     || undefined,
    };
    const hasWeather = Object.values(weatherInfo).some(Boolean);

    mutation.mutate(
      {
        name:                   form.name.trim(),
        description:            form.description.trim(),
        category:               form.category,
        featured:               form.featured,
        latitude:               Number(form.latitude),
        longitude:              Number(form.longitude),
        district:               form.district.trim() || undefined,
        bestVisitingSeason:     form.bestVisitingSeason.trim()     || undefined,
        estimatedVisitingTime:  form.estimatedVisitingTime.trim()  || undefined,
        openingHours:           form.openingHours.trim()           || undefined,
        entryFee:               form.entryFee ? Number(form.entryFee) : undefined,
        travelTips:             form.travelTips.trim()             || undefined,
        coverImage:             form.coverImage.trim()             || undefined,
        images:                 form.images.length ? form.images   : undefined,
        weatherInfo:            hasWeather ? weatherInfo           : undefined,
      },
      { onSuccess: () => router.push('/admin/destinations') },
    );
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div className="space-y-6">
      <FormStepper steps={STEPS} current={step} onStepClick={(i) => i < step && setStep(i)} />

      {/* ── Step 0 — Basic Info ─────────────────────────────────── */}
      {step === 0 && (
        <StepCard>
          <div ref={wrapperRef} className="relative">
            <FieldLabel htmlFor="dest-name">Name *</FieldLabel>
            <div className="relative flex items-center">
              <Input
                id="dest-name"
                required
                autoComplete="off"
                placeholder="e.g. Sigiriya Rock Fortress"
                value={form.name}
                className="pr-10"
                onChange={(e) => { handleNameChange(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              />
              <button
                type="button"
                onClick={handleSearchClick}
                className="absolute right-2 text-gray-400 hover:text-teal-600 transition-colors"
                tabIndex={-1}
              >
                <Search size={16} />
              </button>
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg text-sm overflow-hidden">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onMouseDown={() => handleSelectSuggestion(s)}
                    className="px-3 py-2 cursor-pointer hover:bg-teal-50 hover:text-teal-700 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate flex-1">{s.place_name}</span>
                      {s.place_type.includes('poi') && (
                        <span className="shrink-0 text-[10px] font-medium bg-teal-100 text-teal-700 rounded px-1.5 py-0.5">Attraction</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="dest-desc">Description *</FieldLabel>
            <Textarea
              id="dest-desc"
              required
              rows={4}
              placeholder="Describe this destination…"
              value={form.description}
              onChange={(e) => { set('description', e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="dest-category">Category *</FieldLabel>
              <StyledSelect
                id="dest-category"
                value={form.category}
                onChange={(e) => set('category', e.target.value as DestinationCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                ))}
              </StyledSelect>
            </div>

            <div>
              <FieldLabel htmlFor="dest-status">Status</FieldLabel>
              <StyledSelect
                id="dest-status"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </StyledSelect>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="dest-featured"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="dest-featured" className="text-sm text-gray-700">Mark as Featured</label>
          </div>
        </StepCard>
      )}

      {/* ── Step 1 — Location & Visit ───────────────────────────── */}
      {step === 1 && (
        <StepCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="dest-lat" hint="Decimal degrees e.g. 7.9570">Latitude *</FieldLabel>
              <Input
                id="dest-lat"
                type="number"
                step="any"
                placeholder="7.9570"
                value={form.latitude}
                onChange={(e) => { set('latitude', e.target.value); setErrors((p) => ({ ...p, latitude: '' })); }}
                onBlur={() => {
                  const lat = parseFloat(form.latitude);
                  const lng = parseFloat(form.longitude);
                  if (!isNaN(lat) && !isNaN(lng)) reverseGeocodeDistrict(lat, lng);
                }}
              />
              {errors.latitude && <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>}
            </div>
            <div>
              <FieldLabel htmlFor="dest-lng" hint="Decimal degrees e.g. 80.7603">Longitude *</FieldLabel>
              <Input
                id="dest-lng"
                type="number"
                step="any"
                placeholder="80.7603"
                value={form.longitude}
                onChange={(e) => { set('longitude', e.target.value); setErrors((p) => ({ ...p, longitude: '' })); }}
                onBlur={() => {
                  const lat = parseFloat(form.latitude);
                  const lng = parseFloat(form.longitude);
                  if (!isNaN(lat) && !isNaN(lng)) reverseGeocodeDistrict(lat, lng);
                }}
              />
              {errors.longitude && <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>}
            </div>
            <div>
              <FieldLabel htmlFor="dest-season">Best Visiting Season</FieldLabel>
              <Input
                id="dest-season"
                placeholder="e.g. December – April"
                value={form.bestVisitingSeason}
                onChange={(e) => set('bestVisitingSeason', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="dest-visit-time">Estimated Visiting Time</FieldLabel>
              <Input
                id="dest-visit-time"
                placeholder="e.g. 2–3 hours"
                value={form.estimatedVisitingTime}
                onChange={(e) => set('estimatedVisitingTime', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="dest-hours">Opening Hours</FieldLabel>
              <Input
                id="dest-hours"
                placeholder="e.g. 7:00 AM – 5:30 PM"
                value={form.openingHours}
                onChange={(e) => set('openingHours', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="dest-fee">Entry Fee (USD)</FieldLabel>
              <Input
                id="dest-fee"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.entryFee}
                onChange={(e) => set('entryFee', e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel
              htmlFor="dest-district"
              hint={districtLoading ? 'Detecting district…' : 'Auto-detected from coordinates. You can edit.'}
            >
              District
            </FieldLabel>
            <Input
              id="dest-district"
              placeholder="e.g. Kegalle District"
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
              disabled={districtLoading}
            />
          </div>

          <div>
            <FieldLabel htmlFor="dest-tips">Travel Tips</FieldLabel>
            <Textarea
              id="dest-tips"
              rows={3}
              placeholder="Useful tips for visitors…"
              value={form.travelTips}
              onChange={(e) => set('travelTips', e.target.value)}
            />
          </div>

          {(() => {
            const lat = parseFloat(form.latitude);
            const lng = parseFloat(form.longitude);
            const valid = !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
            return valid ? (
              <div>
                <FieldLabel>Map Preview</FieldLabel>
                <MapboxMap
                  height="300px"
                  center={[lng, lat]}
                  zoom={12}
                  markers={[{ id: 'preview', name: form.name || 'New Destination', latitude: lat, longitude: lng }]}
                />
              </div>
            ) : null;
          })()}
        </StepCard>
      )}

      {/* ── Step 2 — Weather ────────────────────────────────────── */}
      {step === 2 && (
        <StepCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="dest-temp">Temperature</FieldLabel>
              <Input
                id="dest-temp"
                placeholder="e.g. 25–30°C"
                value={form.temperature}
                onChange={(e) => set('temperature', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="dest-humidity">Humidity</FieldLabel>
              <Input
                id="dest-humidity"
                placeholder="e.g. 70%"
                value={form.humidity}
                onChange={(e) => set('humidity', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="dest-rainfall">Rainfall</FieldLabel>
              <Input
                id="dest-rainfall"
                placeholder="e.g. Low"
                value={form.rainfall}
                onChange={(e) => set('rainfall', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="dest-condition">Condition</FieldLabel>
              <Input
                id="dest-condition"
                placeholder="e.g. Sunny"
                value={form.condition}
                onChange={(e) => set('condition', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="dest-climate">Climate</FieldLabel>
              <Input
                id="dest-climate"
                placeholder="e.g. Tropical dry zone"
                value={form.climate}
                onChange={(e) => set('climate', e.target.value)}
              />
            </div>
          </div>
        </StepCard>
      )}

      {/* ── Step 3 — Images ─────────────────────────────────────── */}
      {step === 3 && (
        <StepCard>
          <ImageUploadField
            label="Cover Image"
            hint="Main image shown in listings."
            value={form.coverImage}
            onChange={(url) => set('coverImage', url)}
          />
          <div className="border-t border-gray-100 pt-5">
            <ImageUploadField
              label="Gallery Images"
              hint="Additional photos for this destination."
              multiple
              values={form.images}
              onChangeMultiple={(urls) => set('images', urls)}
            />
          </div>
        </StepCard>
      )}

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-8">
        <Button
          variant="secondary"
          onClick={() => (step === 0 ? router.back() : setStep((s) => s - 1))}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>

        {isLast ? (
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create Destination'}
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
