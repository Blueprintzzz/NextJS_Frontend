'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

const SRI_LANKA_DESTINATIONS = [
  { name: 'Colombo',      lat: 6.9271, lng: 79.8612 },
  { name: 'Kandy',        lat: 7.2906, lng: 80.6337 },
  { name: 'Galle',        lat: 6.0535, lng: 80.2210 },
  { name: 'Ella',         lat: 6.8667, lng: 81.0466 },
  { name: 'Sigiriya',     lat: 7.9570, lng: 80.7603 },
  { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891 },
  { name: 'Yala',         lat: 6.3728, lng: 81.5165 },
  { name: 'Mirissa',      lat: 5.9483, lng: 80.4589 },
  { name: 'Bentota',      lat: 6.4260, lng: 79.9955 },
  { name: 'Trincomalee',  lat: 8.5874, lng: 81.2152 },
  { name: 'Jaffna',       lat: 9.6615, lng: 80.0255 },
  { name: 'Anuradhapura', lat: 8.3114, lng: 80.4037 },
  { name: 'Polonnaruwa',  lat: 7.9403, lng: 81.0188 },
  { name: 'Dambulla',     lat: 7.8675, lng: 80.6517 },
  { name: 'Arugam Bay',   lat: 6.8400, lng: 81.8360 },
] as const;

const SRI_LANKA_CENTER: [number, number] = [80.7718, 7.8731];
const SRI_LANKA_DEFAULT_ZOOM = 6.6;

type DistrictItem = {
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

function DestinationMap({
  selected,
  extras,
}: {
  selected: string[];
  extras: { name: string; latitude: number; longitude: number }[];
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const markersRef   = useRef<mapboxgl.Marker[]>([]);
  const token        = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Init map once
  useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: SRI_LANKA_CENTER,
      zoom: SRI_LANKA_DEFAULT_ZOOM,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, [token]);

  // Update markers whenever selection or extras change
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const presetPoints = SRI_LANKA_DESTINATIONS.filter(d => selected.includes(d.name));

    presetPoints.forEach(d => {
      const marker = new mapboxgl.Marker({ color: '#0d9488' })
        .setLngLat([d.lng, d.lat])
        .setPopup(new mapboxgl.Popup({ offset: 20 }).setText(d.name))
        .addTo(mapRef.current as mapboxgl.Map);
      markersRef.current.push(marker);
    });

    extras.forEach(d => {
      const marker = new mapboxgl.Marker({ color: '#7c3aed' })
        .setLngLat([d.longitude, d.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 20 }).setText(d.name + ' ✦'))
        .addTo(mapRef.current as mapboxgl.Map);
      markersRef.current.push(marker);
    });

    const allPoints = [
      ...presetPoints.map(d => ({ lng: d.lng, lat: d.lat })),
      ...extras.map(d => ({ lng: d.longitude, lat: d.latitude })),
    ];

    if (allPoints.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      allPoints.forEach(p => bounds.extend([p.lng, p.lat]));
      mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 10, duration: 600 });
    } else {
      mapRef.current.flyTo({ center: SRI_LANKA_CENTER, zoom: SRI_LANKA_DEFAULT_ZOOM, duration: 600 });
    }
  }, [selected, extras]);

  if (!token) {
    return (
      <div className="w-full h-full min-h-[280px] rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
        Map preview unavailable
      </div>
    );
  }
  return <div ref={mapContainer} className="w-full h-full min-h-[280px] rounded-xl overflow-hidden" />;
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomizeTourPage() {
  const [step, setStep] = useState(1);

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

  // Extra destinations picked from API districts (have lat/lng)
  const [extraDestinations, setExtraDestinations] = useState<DistrictItem[]>([]);

  // District search UI state
  const [allDistricts,     setAllDistricts]     = useState<DistrictItem[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [districtSearch,   setDistrictSearch]   = useState('');
  const [districtsFetched, setDistrictsFetched] = useState(false);

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

  const toggleDestination = (name: string) =>
    setDestinations((prev) => prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]);

  const addExtraDestination = (district: DistrictItem) => {
    const alreadyPreset = SRI_LANKA_DESTINATIONS.some(
      d => d.name.toLowerCase() === district.name.toLowerCase()
    );
    const alreadyExtra = extraDestinations.some(d => d.id === district.id);
    if (alreadyPreset || alreadyExtra) return;
    setExtraDestinations(prev => [...prev, district]);
    setDistrictSearch('');
  };

  const removeExtraDestination = (id: string) => {
    setExtraDestinations(prev => prev.filter(d => d.id !== id));
  };

  const filteredDistricts = districtSearch.trim().length > 0
    ? allDistricts.filter(d =>
        d.name.toLowerCase().includes(districtSearch.toLowerCase()) &&
        !extraDestinations.some(e => e.id === d.id) &&
        !SRI_LANKA_DESTINATIONS.some(
          p => p.name.toLowerCase() === d.name.toLowerCase()
        )
      )
    : [];

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

  // ── Fetch districts when step 5 is first reached ────────────────────────────
  useEffect(() => {
    if (step !== 5 || districtsFetched) return;
    setDistrictsFetched(true);
    setDistrictsLoading(true);
    fetch(`${API_URL}/districts`)
      .then(async res => {
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        const list: DistrictItem[] = (
          Array.isArray(data) ? data :
          Array.isArray(data?.data) ? data.data : []
        ).filter((d: DistrictItem) =>
          d.name && d.latitude != null && d.longitude != null
        );
        setAllDistricts(list);
      })
      .catch(() => {
        setDistrictsFetched(false); // allow retry
      })
      .finally(() => setDistrictsLoading(false));
  }, [step, districtsFetched]);

  // ── Fetch vehicles when step 6 is reached (cached after first load) ────────
  const vehiclesFetchedRef = useRef(false);
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
    setError(null);
    setSubmitting(true);
    const message = buildMessage({
      tourTypes, duration, groupSize, budget, startDate, destinations,
      extraDestinations: extraDestinations.map(d => d.name), specialRequests,
      selectedVehicleName: vehicles.find((v) => v.id === selectedVehicleId)
        ? getVehicleName(vehicles.find((v) => v.id === selectedVehicleId)!)
        : null,
    });
    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), subject: 'Custom Tour Request', message, category: 'GENERAL' }),
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
                        {SRI_LANKA_DESTINATIONS.map((d) => {
                          const active = destinations.includes(d.name);
                          return (
                            <button suppressHydrationWarning key={d.name} type="button" onClick={() => toggleDestination(d.name)}
                              className={['inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer',
                                active ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-600 hover:border-teal-400'].join(' ')}>
                              {active ? '📍' : '○'} {d.name}
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
                          placeholder={districtsLoading ? 'Loading districts…' : 'Type to search districts…'}
                          disabled={districtsLoading}
                          className={inputCls}
                        />

                        {/* Dropdown results */}
                        {filteredDistricts.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-20 mt-1
                                          bg-white border border-gray-200 rounded-xl
                                          shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                            {filteredDistricts.map(d => (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => addExtraDestination(d)}
                                className="w-full text-left px-4 py-2.5 text-sm
                                           text-gray-700 hover:bg-teal-50
                                           hover:text-teal-700 transition-colors
                                           flex items-center gap-2 border-b
                                           border-gray-50 last:border-0"
                              >
                                <span className="text-violet-500">🟣</span>
                                {d.name}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* No results hint */}
                        {districtSearch.trim().length > 0 &&
                         filteredDistricts.length === 0 &&
                         !districtsLoading && (
                          <div className="absolute top-full left-0 right-0 z-20 mt-1
                                          bg-white border border-gray-200 rounded-xl
                                          shadow-sm px-4 py-3 text-xs text-gray-400">
                            No matching districts found.
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
                      <DestinationMap
                        selected={destinations}
                        extras={extraDestinations}
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
