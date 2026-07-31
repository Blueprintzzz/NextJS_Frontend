'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapboxMap } from '@/components/shared/MapboxMapDynamic';
import type { MapboxMarker } from '@/components/shared/MapboxMapDynamic';
import { searchPlaces } from '@/lib/geocoding';
import type { GeoSuggestion } from '@/lib/geocoding';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const TOUR_TYPES = [
  { value: 'ADVENTURE', label: 'Adventure', icon: '🧗' },
  { value: 'NATURE',    label: 'Nature',    icon: '🌿' },
  { value: 'CULTURAL',  label: 'Cultural',  icon: '🏛️' },
  { value: 'ROMANTIC',  label: 'Romantic',  icon: '💑' },
  { value: 'WILDLIFE',  label: 'Wildlife',  icon: '🐘' },
  { value: 'FAMILY',    label: 'Family',    icon: '👨‍👩‍👧‍👦' },
  { value: 'BEACH',     label: 'Beach',     icon: '🏖️' },
  { value: 'LUXURY',    label: 'Luxury',    icon: '✨' },
];

const DURATION_OPTIONS = ['1–3 days', '4–7 days', '8–14 days', '15–21 days', '22+ days'];

const GROUP_SIZES = [
  { label: 'Solo',          value: '1',    icon: '🧍' },
  { label: 'Couple',        value: '2',    icon: '👫' },
  { label: 'Small (3–6)',   value: '3–6',  icon: '👨‍👩‍👧‍👦' },
  { label: 'Medium (7–15)', value: '7–15', icon: '👥' },
  { label: 'Large (16+)',   value: '16+',  icon: '🚌' },
];

const BUDGET_RANGES = [
  'Under $500', '$500 – $1,000', '$1,000 – $2,500',
  '$2,500 – $5,000', '$5,000+', 'Flexible',
];

const TOTAL_STEPS = 6;
const STEP_LABELS = ['Contact', 'Tour Type', 'Duration & Group', 'Budget & Date', 'Destinations', 'Vehicle'];

type AttractionItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  district?: string;
  images?: string[];
  latitude: number;
  longitude: number;
  featured?: boolean;
  status?: string;
};

type ExtraDestination = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

function buildMessage(f: {
  tourTypes: string[];
  duration: string;
  groupSize: string;
  budget: string;
  startDate: string;
  destinations: string[];
  extraDestinations: string[];
  specialRequests: string;
  selectedVehicleName: string | null;
}): string {
  const allDest = [...f.destinations, ...f.extraDestinations];
  const destFull = allDest.length > 0
    ? allDest.join(', ')
    : 'Open to suggestions';

  return [
    `Tour Types: ${f.tourTypes.length ? f.tourTypes.join(', ') : 'Not specified'}`,
    `Duration: ${f.duration || 'Not specified'}`,
    `Group Size: ${f.groupSize || 'Not specified'}`,
    `Budget Range: ${f.budget || 'Not specified'}`,
    `Preferred Start Date: ${f.startDate || 'Flexible'}`,
    `Preferred Destinations: ${destFull}`,
    `Preferred Vehicle: ${f.selectedVehicleName ?? 'No preference'}`,
    '',
    'Special Requests / Notes:',
    f.specialRequests || 'None',
  ].join('\n');
}

// ── Shared small components ───────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 ' +
  'focus:border-teal-400 transition-colors bg-white';

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Stepper({ current, labels, onStepClick }: { current: number; labels: string[]; onStepClick: (step: number) => void }) {
  return (
    <div className="flex items-start w-full px-6 sm:px-10 py-6 bg-white">
      {labels.map((label, i) => {
        const stepNum     = i + 1;
        const isActive    = stepNum === current;
        const isCompleted = stepNum < current;
        return (
          <div key={label} className={`flex items-center ${i === labels.length - 1 ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center gap-1.5">
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => isCompleted && onStepClick(stepNum)}
                disabled={!isCompleted}
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors flex-shrink-0',
                  isCompleted ? 'bg-teal-600 border-teal-600 text-white cursor-pointer'
                    : isActive ? 'border-teal-500 text-teal-600 bg-white'
                    : 'border-gray-200 text-gray-300 bg-white cursor-default',
                ].join(' ')}
              >
                {isCompleted ? '✓' : stepNum}
              </button>
              <span className={[
                'hidden sm:block text-[11px] font-medium text-center max-w-[90px] leading-tight',
                isActive ? 'text-teal-700' : isCompleted ? 'text-teal-600' : 'text-gray-400',
              ].join(' ')}>
                {label}
              </span>
            </div>
            {i !== labels.length - 1 && (
              <div className={['flex-1 h-[2px] mx-2 mt-4 sm:mt-0 transition-colors', isCompleted ? 'bg-teal-600' : 'bg-gray-200'].join(' ')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Vehicle type ─────────────────────────────────────────────────────────────

type VehicleApiItem = {
  id: string;
  name?: string; title?: string;
  type?: string; category?: string; vehicleType?: string;
  capacity?: number; seats?: number;
  pricePerDay?: number; price?: number;
  images?: string[];
};

function getVehicleName(v: VehicleApiItem): string { return v.name ?? v.title ?? 'Unnamed Vehicle'; }
function getVehicleType(v: VehicleApiItem): string { return v.type ?? v.category ?? v.vehicleType ?? ''; }
function getVehicleCapacity(v: VehicleApiItem): number | null { return v.capacity ?? v.seats ?? null; }
function getVehiclePrice(v: VehicleApiItem): number | null { return v.pricePerDay ?? v.price ?? null; }
function getVehicleImage(v: VehicleApiItem): string | null {
  const first = v.images?.find((url) => !!url && url.trim() !== '');
  return first ?? null;
}

// ── Helpers for CustomBooking payload ────────────────────────────────────────

function parseGroupSize(groupSize: string): number {
  if (groupSize === '1')    return 1;
  if (groupSize === '2')    return 2;
  if (groupSize === '3–6')  return 4;
  if (groupSize === '7–15') return 10;
  if (groupSize === '16+')  return 16;
  return 1;
}

function parseBudget(budget: string): number | null {
  if (!budget || budget === 'Flexible') return null;
  if (budget === 'Under $500')          return 400;
  if (budget === '$500 – $1,000')       return 750;
  if (budget === '$1,000 – $2,500')     return 1750;
  if (budget === '$2,500 – $5,000')     return 3750;
  if (budget === '$5,000+')             return 5000;
  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomizeTourPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const raw = localStorage.getItem('tfx_auth');
    if (!raw) { router.replace('/login?redirect=/tours/customize'); return; }
    try {
      const { accessToken, user } = JSON.parse(raw);
      if (!accessToken || !user) { router.replace('/login?redirect=/tours/customize'); return; }
      if (user.role !== 'TOURIST') { router.replace('/'); return; }
      setAuthChecked(true);
    } catch {
      router.replace('/login?redirect=/tours/customize');
    }
  }, [router]);

  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [tourTypes,        setTourTypes]        = useState<string[]>([]);
  const [duration,         setDuration]         = useState('');
  const [groupSize,        setGroupSize]         = useState('');
  const [budget,           setBudget]            = useState('');
  const [startDate,        setStartDate]         = useState('');
  const [destinations,     setDestinations]      = useState<string[]>([]);
  const [specialRequests,  setSpecialRequests]   = useState('');

  // Attractions fetched from API (chip grid)
  const [attractions,      setAttractions]      = useState<AttractionItem[]>([]);
  const [attractionsFetched, setAttractionsFetched] = useState(false);

  // Extra destinations from geocoding search
  const [extraDestinations, setExtraDestinations] = useState<ExtraDestination[]>([]);

  // Geocoding search UI state
  const [districtSearch,   setDistrictSearch]   = useState('');
  const [geoResults,       setGeoResults]       = useState<GeoSuggestion[]>([]);
  const [geoSearching,     setGeoSearching]     = useState(false);
  const geoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // ── Vehicle state ──────────────────────────────────────────────────────────
  const [vehicles,         setVehicles]         = useState<VehicleApiItem[]>([]);
  const [vehiclesLoading,  setVehiclesLoading]  = useState(false);
  const [vehiclesError,    setVehiclesError]    = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const toggleTourType = (value: string) =>
    setTourTypes((prev) => prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]);

  const toggleDestination = (id: string) =>
    setDestinations((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);

  const addExtraDestination = (suggestion: GeoSuggestion) => {
    const [lng, lat] = suggestion.center;
    const id = `${suggestion.place_name}-${suggestion.center.join(',')}`;
    const nameLower = suggestion.place_name.toLowerCase();
    if (
      extraDestinations.some(d => d.id === id) ||
      attractions.some(a => a.name.toLowerCase() === nameLower)
    ) return;
    setExtraDestinations(prev => [...prev, { id, name: suggestion.place_name, latitude: lat, longitude: lng }]);
    setDistrictSearch('');
    setGeoResults([]);
  };

  const removeExtraDestination = (id: string) => {
    setExtraDestinations(prev => prev.filter(d => d.id !== id));
  };

  const goNext = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim()) { setError('Please fill in your name and email.'); return; }
      if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => { setError(null); setStep((s) => Math.max(s - 1, 1)); };
  const goToStep = (target: number) => { if (target < step) setStep(target); };

  // ── Fetch attractions when step 5 is first reached ──────────────────────────
  useEffect(() => {
    if (step !== 5 || attractionsFetched) return;
    setAttractionsFetched(true);
    fetch(`${API_URL}/destinations?limit=100`)
      .then(async res => {
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        const list: AttractionItem[] = (
          Array.isArray(data) ? data :
          Array.isArray(data?.data) ? data.data : []
        ).filter((d: AttractionItem) => d.name && d.latitude != null && d.longitude != null);
        setAttractions(list);
      })
      .catch(() => setAttractionsFetched(false));
  }, [step, attractionsFetched]);

  // ── Debounced geocoding search ────────────────────────────────────────────────
  useEffect(() => {
    if (geoDebounceRef.current) clearTimeout(geoDebounceRef.current);
    if (districtSearch.trim().length < 2) { setGeoResults([]); setGeoSearching(false); return; }
    setGeoSearching(true);
    geoDebounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(districtSearch);
      setGeoResults(results.filter(r =>
        !extraDestinations.some(e => e.name === r.place_name) &&
        !attractions.some(a => a.name.toLowerCase() === r.place_name.toLowerCase())
      ));
      setGeoSearching(false);
    }, 350);
    return () => { if (geoDebounceRef.current) clearTimeout(geoDebounceRef.current); };
  }, [districtSearch, extraDestinations, attractions]);

  // ── Fetch vehicles when step 6 is reached (cached after first load) ────────
  const vehiclesFetchedRef = useRef(false);

  // ── Build map markers from selected attractions + extras ─────────────────────
  const allMarkers = useMemo<MapboxMarker[]>(() => {
    const selected: MapboxMarker[] = attractions
      .filter(a => destinations.includes(a.id) && a.latitude && a.longitude)
      .map(a => ({ id: a.id, name: a.name, latitude: Number(a.latitude), longitude: Number(a.longitude), color: '#0d9488' }));
    const extras: MapboxMarker[] = extraDestinations.map(d => ({
      id: d.id, name: d.name, latitude: d.latitude, longitude: d.longitude, color: '#7c3aed',
    }));
    return [...selected, ...extras];
  }, [destinations, extraDestinations, attractions]);
  useEffect(() => {
    if (step !== 6 || vehiclesFetchedRef.current) return;
    vehiclesFetchedRef.current = true;
    let cancelled = false;
    setVehiclesLoading(true);
    setVehiclesError(null);
    fetch(`${API_URL}/vehicles`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        const list: VehicleApiItem[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)  ? data.data
          : Array.isArray(data?.items) ? data.items
          : [];
        if (!cancelled) setVehicles(list);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          vehiclesFetchedRef.current = false; // allow retry on next visit to step 6
          setVehiclesError(err instanceof Error ? err.message : 'Failed to load vehicles.');
        }
      })
      .finally(() => { if (!cancelled) setVehiclesLoading(false); });
    return () => { cancelled = true; };
  }, [step]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) { setError('Please fill in your name and email.'); setStep(1); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); setStep(1); return; }

    // Check auth token — read from localStorage the same way the API layer does
    const raw = typeof window !== 'undefined' ? localStorage.getItem('tfx_auth') : null;
    const accessToken = raw ? (JSON.parse(raw) as { accessToken?: string }).accessToken : null;
    if (!accessToken) {
      setError('Please log in to submit your custom tour request.');
      window.location.href = `/login?redirect=${encodeURIComponent('/tours/customize')}`;
      return;
    }

    setError(null);
    setSubmitting(true);

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    const payload = {
      title: `Custom Tour Request – ${name.trim()}`,
      description: buildMessage({
        tourTypes,
        duration,
        groupSize,
        budget,
        startDate,
        destinations: attractions.filter(a => destinations.includes(a.id)).map(a => a.name),
        extraDestinations: extraDestinations.map(d => d.name),
        specialRequests,
        selectedVehicleName: selectedVehicle ? getVehicleName(selectedVehicle) : null,
      }),
      startDate: startDate
        ? new Date(startDate).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: startDate
        ? new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      numberOfPeople: parseGroupSize(groupSize),
      budget: parseBudget(budget),
      pickupLocation: 'To be confirmed',
      dropoffLocation: 'To be confirmed',
      requestedVehicleType: (selectedVehicle
        ? getVehicleType(selectedVehicle).toUpperCase()
        : 'CAR') as 'CAR' | 'SUV' | 'VAN' | 'MINIBUS' | 'LUXURY',
      requestedModelId: selectedVehicleId ?? undefined,
      destinations: [
        ...attractions.filter(a => destinations.includes(a.id)).map(a => a.name),
        ...extraDestinations.map(d => d.name),
      ],
      requirements: specialRequests || undefined,
    };

    try {
      const res = await fetch(`${API_URL}/custom-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string })?.message ?? `Server error ${res.status}`);
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(`Failed to send request: ${err instanceof Error ? err.message : 'Something went wrong.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Auth loading guard ────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Thank you, <span className="font-semibold text-gray-700">{name}</span>! Our travel experts will review your custom tour request and get back to you at{' '}
            <span className="font-semibold text-teal-600">{email}</span> within 24 hours.
          </p>
          <p className="text-xs text-gray-400 mb-8">Check your spam folder if you don&apos;t hear from us.</p>
          <div className="flex flex-col gap-3">
            <Link href="/tours" className="block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors">Browse Tour Packages</Link>
            <Link href="/" className="block w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">Back to Home</Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-52 flex items-center justify-center overflow-hidden">
        <Image src="https://picsum.photos/1920/600?random=customize" alt="Customize your Sri Lanka tour" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative text-center text-white px-4">
          <p className="text-teal-300 font-semibold uppercase tracking-widest text-xs mb-2">Tailor-Made for You</p>
          <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">Customize Your Sri Lanka Tour</h1>
          <p className="text-white/75 text-sm mt-2">Tell us your dream trip — we&apos;ll make it happen.</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-teal-600">Tours</Link>
          <span>/</span>
          <span className="text-gray-600">Customize</span>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header bar */}
          <div className="bg-teal-600 px-8 py-4 flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Custom Tour Request Form</p>
            <span className="text-teal-200 text-xs">Step {step} of {TOTAL_STEPS} · Free · No commitment</span>
          </div>

          {/* Stepper */}
          <Stepper current={step} labels={STEP_LABELS} onStepClick={goToStep} />

          <div className="px-8 pb-8 space-y-8">

            {/* ── Step 1: Contact ── */}
            {step === 1 && (
              <section>
                <SectionHeader number="1" title="Your Contact Details" subtitle="We'll use these to send your personalised itinerary." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="sm:col-span-2">
                    <FieldLabel required>Full Name</FieldLabel>
                    <input suppressHydrationWarning type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. James Anderson" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <input suppressHydrationWarning type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>Phone / WhatsApp</FieldLabel>
                    <input suppressHydrationWarning type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" className={inputCls} />
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 2: Tour Type ── */}
            {step === 2 && (
              <section>
                <SectionHeader number="2" title="What Kind of Tour?" subtitle="Select all that interest you — we'll blend them together." />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {TOUR_TYPES.map((t) => {
                    const active = tourTypes.includes(t.value);
                    return (
                      <button suppressHydrationWarning key={t.value} type="button" onClick={() => toggleTourType(t.value)}
                        className={['flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer',
                          active ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-600', 'hover:border-teal-400'].join(' ')}>
                        <span className="text-2xl">{t.icon}</span>
                        <span className="text-xs">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Step 3: Duration + Group ── */}
            {step === 3 && (
              <section>
                <SectionHeader number="3" title="Duration & Group Size" subtitle="How long and how many people?" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <FieldLabel>Trip Duration</FieldLabel>
                    <div className="flex flex-col gap-2 mt-2">
                      {DURATION_OPTIONS.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer">
                          <input suppressHydrationWarning type="radio" name="duration" value={opt} checked={duration === opt} onChange={() => setDuration(opt)} className="accent-teal-600 w-4 h-4" />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Group Size</FieldLabel>
                    <div className="flex flex-col gap-2 mt-2">
                      {GROUP_SIZES.map((g) => (
                        <label key={g.value} className="flex items-center gap-3 cursor-pointer">
                          <input suppressHydrationWarning type="radio" name="groupSize" value={g.value} checked={groupSize === g.value} onChange={() => setGroupSize(g.value)} className="accent-teal-600 w-4 h-4" />
                          <span className="text-sm text-gray-700">{g.icon} {g.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 4: Budget + Date ── */}
            {step === 4 && (
              <section>
                <SectionHeader number="4" title="Budget & Travel Date" subtitle="Per person estimates help us tailor the best options." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <FieldLabel>Budget per Person (USD)</FieldLabel>
                    <div className="flex flex-col gap-2 mt-2">
                      {BUDGET_RANGES.map((b) => (
                        <label key={b} className="flex items-center gap-3 cursor-pointer">
                          <input suppressHydrationWarning type="radio" name="budget" value={b} checked={budget === b} onChange={() => setBudget(b)} className="accent-teal-600 w-4 h-4" />
                          <span className="text-sm text-gray-700">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Preferred Start Date</FieldLabel>
                    <input suppressHydrationWarning type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputCls + ' mt-2'} />
                    <p className="text-xs text-gray-400 mt-1.5">Leave blank if your dates are flexible.</p>
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 5: Destinations + Notes ── */}
            {step === 5 && (
              <section>
                <SectionHeader number="5" title="Destinations & Special Requests" subtitle="Pin your dream spots on the map, then add any special notes." />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

                  {/* Left column — chips + other input + notes */}
                  <div className="space-y-5">
                    <div>
                      <FieldLabel>Preferred Destinations in Sri Lanka</FieldLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {attractions.length === 0 ? (
                          <p className="text-xs text-gray-400">Loading destinations…</p>
                        ) : attractions.map((a) => {
                          const active = destinations.includes(a.id);
                          return (
                            <button suppressHydrationWarning key={a.id} type="button" onClick={() => toggleDestination(a.id)}
                              className={['inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer',
                                active ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-600 hover:border-teal-400'].join(' ')}>
                              {active ? '📍' : '○'} {a.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Other place not listed?</FieldLabel>
                      <p className="text-xs text-gray-400 mb-2">
                        Search and select — it will appear on the map 🟣
                      </p>

                      {/* Search input */}
                      <div className="relative">
                        <input
                          suppressHydrationWarning
                          type="text"
                          value={districtSearch}
                          onChange={e => setDistrictSearch(e.target.value)}
                          placeholder="Type to search any place in Sri Lanka…"
                          className={inputCls}
                        />

                        {/* Searching indicator */}
                        {geoSearching && (
                          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 text-xs text-gray-400">
                            Searching…
                          </div>
                        )}

                        {/* Dropdown results */}
                        {!geoSearching && geoResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                            {geoResults.map(r => (
                              <button
                                key={r.place_name}
                                type="button"
                                onClick={() => addExtraDestination(r)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-2 border-b border-gray-50 last:border-0"
                              >
                                <span className="text-violet-500">🟣</span>
                                {r.place_name}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* No results hint */}
                        {!geoSearching && districtSearch.trim().length >= 2 && geoResults.length === 0 && (
                          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 text-xs text-gray-400">
                            No places found.
                          </div>
                        )}
                      </div>

                      {/* Selected extra destinations as removable pills */}
                      {extraDestinations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {extraDestinations.map(d => (
                            <span
                              key={d.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5
                                         rounded-xl border-2 border-violet-300
                                         bg-violet-50 text-violet-700
                                         text-xs font-semibold"
                            >
                              🟣 {d.name}
                              <button
                                type="button"
                                onClick={() => removeExtraDestination(d.id)}
                                className="ml-0.5 text-violet-400 hover:text-red-500
                                           font-bold cursor-pointer bg-transparent
                                           border-none text-xs leading-none"
                              >×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <FieldLabel>Special Requests or Notes</FieldLabel>
                      <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={4}
                        placeholder="e.g. vegetarian meals, wheelchair access, anniversary surprise, specific hotels, avoid long drives…"
                        className={inputCls + ' resize-none'} />
                    </div>
                  </div>

                  {/* Right column — map */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your route so far</p>
                    <div className="h-full min-h-[320px]">
                      <MapboxMap
                        markers={allMarkers}
                        height="320px"
                      />
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-3 h-3 rounded-full bg-teal-500 inline-block flex-shrink-0" />
                        Selected destination
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-3 h-3 rounded-full bg-violet-600 inline-block flex-shrink-0" />
                        Other district
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 6: Vehicle ── */}
            {step === 6 && (
              <section>
                <SectionHeader number="6" title="Choose a Vehicle" subtitle="Pick the vehicle you'd like for this trip (optional)." />

                {vehiclesLoading && (
                  <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                    Loading vehicles…
                  </div>
                )}

                {vehiclesError && !vehiclesLoading && (
                  <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-100 mt-4">
                    <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                    <p className="text-sm text-red-600">Couldn&apos;t load vehicles: {vehiclesError}</p>
                  </div>
                )}

                {!vehiclesLoading && !vehiclesError && vehicles.length === 0 && (
                  <p className="text-sm text-gray-400 py-6 text-center">
                    No vehicles available right now — you can skip this step.
                  </p>
                )}

                {!vehiclesLoading && !vehiclesError && vehicles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {vehicles.map((v) => {
                      const active    = selectedVehicleId === v.id;
                      const img       = getVehicleImage(v);
                      const price     = getVehiclePrice(v);
                      const capacity  = getVehicleCapacity(v);
                      const vtype     = getVehicleType(v);
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVehicleId((prev) => prev === v.id ? null : v.id)}
                          className={[
                            'rounded-2xl border-2 overflow-hidden transition-all cursor-pointer',
                            active ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:border-teal-300',
                          ].join(' ')}
                        >
                          {img && (
                            <div className="relative w-full h-32 bg-gray-100">
                              <img src={img} alt={getVehicleName(v)} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-bold text-sm text-gray-900">{getVehicleName(v)}</p>
                                {vtype && <p className="text-xs text-gray-400 mt-0.5">{vtype}</p>}
                              </div>
                              {active && <span className="text-teal-600 text-lg flex-shrink-0">✓</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              {capacity !== null && <span>👥 {capacity} seats</span>}
                              {price !== null && <span>💰 ${price}/day</span>}
                            </div>
                            <a
                              href={`/vehicles/${v.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-block mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700"
                            >
                              View details →
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-4">
                  This step is optional — you can submit your request without selecting a vehicle and our team will recommend one.
                </p>
              </section>
            )}

            {/* ── Error ── */}
            {error && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-100">
                <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
              {step === TOTAL_STEPS ? (
                <p className="text-xs text-gray-400 text-left">
                  🔒 Your information is kept private and never shared.<br />Our team will reply within 24 hours.
                </p>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button suppressHydrationWarning type="button" onClick={goBack} disabled={step === 1}
                  className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  ← Back
                </button>
                {step < TOTAL_STEPS ? (
                  <button suppressHydrationWarning type="button" onClick={goNext} className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors">
                    Next →
                  </button>
                ) : (
                  <button suppressHydrationWarning type="button" onClick={handleSubmit} disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0">
                    {submitting ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>) : <>✈️ Send My Request</>}
                  </button>
                )}
              </div>
            </div>

          </div>{/* end px-8 pb-8 */}
        </div>{/* end form card */}

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-gray-400">
          {[{ icon: '✅', label: 'Free consultation' }, { icon: '⚡', label: 'Reply within 24h' }, { icon: '🔒', label: 'No payment required' }, { icon: '🌟', label: 'Expert local guides' }].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5"><span>{b.icon}</span><span>{b.label}</span></div>
          ))}
        </div>
      </div>{/* end max-w-3xl */}
    </main>
  );
}
