'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Clock, Users, Star, Car, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FormStepper } from '@/components/shared/FormStepper';
import { PriceInput } from '@/components/shared/PriceInput';
import { PassengerForm } from './PassengerForm';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { usePackageById } from '@/features/package';
import { useVehicles, useCheckAvailability } from '@/features/vehicle';
import { formatPrice } from '@/features/package';
import type { Booking, CreateBookingInput, CreatePassengerInput } from '../types/booking.types';
import type { Vehicle } from '@/features/vehicle';

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Your Package',       description: 'Confirm your tour' },
  { label: 'Travel Dates',       description: 'When are you going?' },
  { label: 'Choose a Vehicle',   description: 'Optional transport' },
  { label: 'Passenger Details',  description: 'Traveller info' },
  { label: 'Review & Confirm',   description: 'Finalize your booking' },
];

const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

interface CreateBookingFormProps {
  initialPackageId?: string;
  initialGuests?: number;
  onSuccess?: (booking: Booking) => void;
  onCancel?: () => void;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{children}</label>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-6 py-6 space-y-5">
      {children}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

const VEHICLE_TYPE_ICONS: Record<string, string> = {
  CAR: '🚗', SUV: '🚙', VAN: '🚐', MINIBUS: '🚌', LUXURY: '✨',
};

// ─── Vehicle card ─────────────────────────────────────────────────────────────
function VehicleCard({
  vehicle, selected, onSelect, available,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: () => void;
  available?: boolean;
}) {
  const unavailable = available === false;
  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={onSelect}
      className={[
        'w-full text-left rounded-xl border-2 transition-all overflow-hidden',
        selected
          ? 'border-teal-500 bg-teal-50 shadow-md'
          : unavailable
          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
          : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-sm cursor-pointer',
      ].join(' ')}
    >
      {/* Image strip */}
      <div className="relative h-32 bg-gray-100">
        {vehicle.images?.[0] ? (
          <Image src={vehicle.images[0]} alt={vehicle.name ?? 'Vehicle'} fill className="object-cover" sizes="300px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {VEHICLE_TYPE_ICONS[vehicle.type] ?? '🚗'}
          </div>
        )}
        {unavailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded-full">Not available</span>
          </div>
        )}
        {selected && !unavailable && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-5 h-5 text-teal-600 bg-white rounded-full" />
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="font-semibold text-sm text-gray-900 line-clamp-1">{vehicle.name}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Car className="w-3 h-3" />{vehicle.type}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{vehicle.capacity} seats</span>
        </div>
        <p className="text-sm font-semibold text-teal-700">{formatPrice(vehicle.pricePerDay)}<span className="text-xs text-gray-400 font-normal">/day</span></p>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CreateBookingForm({ initialPackageId, initialGuests = 1, onSuccess, onCancel }: CreateBookingFormProps) {
  const router   = useRouter();
  const mutation = useCreateBooking();
  const [step, setStep] = useState(0);

  // Core booking state
  const [tourPackageId,      setTourPackageId]      = useState(initialPackageId ?? '');
  const [vehicleId,          setVehicleId]          = useState('');
  const [startDate,          setStartDate]          = useState('');
  const [endDate,            setEndDate]            = useState('');
  const [numberOfPassengers, setNumberOfPassengers] = useState(initialGuests);
  const [advancePayment,     setAdvancePayment]     = useState(0);
  const [specialRequests,    setSpecialRequests]    = useState('');
  const [passengers,         setPassengers]         = useState<CreatePassengerInput[]>([]);
  const [errors,             setErrors]             = useState<Record<string, string>>({});

  // Package lookup (pre-filled from URL param)
  const { data: selectedPackage, isLoading: pkgLoading } = usePackageById(tourPackageId || null);

  // Vehicles list
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles({ status: 'ACTIVE' } as never);

  // Availability check once dates are set
  const { data: availability } = useCheckAvailability(
    startDate || null,
    endDate   || null,
  );

  // Build availability map: vehicleId → true/false
  const availabilityMap: Record<string, boolean> = {};
  availability.forEach((a) => { availabilityMap[a.vehicleId] = a.available; });

  // Auto-compute end date when package duration is known
  useEffect(() => {
    if (selectedPackage && startDate && !endDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + selectedPackage.duration);
      setEndDate(start.toISOString().split('T')[0]);
    }
  }, [selectedPackage, startDate, endDate]);

  // Validation per step
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !tourPackageId) e.tourPackageId = 'Please select a tour package.';
    if (step === 1) {
      if (!startDate) e.startDate = 'Start date is required.';
      if (!endDate)   e.endDate   = 'End date is required.';
      if (startDate && endDate && startDate >= endDate) e.endDate = 'End date must be after start date.';
      if (startDate && startDate < tomorrow) e.startDate = 'Start date must be in the future.';
      if (numberOfPassengers < 1) e.numberOfPassengers = 'At least 1 passenger required.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // If no package is selected on step 0, there's nothing to do — user must browse tours
  const canProceedStep0 = step !== 0 || !!selectedPackage;
  const tryNext = () => { if (canProceedStep0 && validate()) setStep((s) => s + 1); };
  const goBack  = () => { setErrors({}); setStep((s) => s - 1); };

  // Passenger helpers
  const addPassenger    = (data: CreatePassengerInput) => setPassengers((p) => [...p, data]);
  const removePassenger = (i: number) => setPassengers((p) => p.filter((_, idx) => idx !== i));

  // Submit
  const handleSubmit = () => {
    const payload: CreateBookingInput = {
      tourPackageId,
      vehicleId:         vehicleId || undefined,
      startDate:         new Date(startDate + 'T12:00:00.000Z').toISOString(),
      endDate:           new Date(endDate   + 'T12:00:00.000Z').toISOString(),
      numberOfPassengers,
      advancePayment:    advancePayment > 0 ? advancePayment : undefined,
      specialRequests:   specialRequests || undefined,
      passengers,
    };
    mutation.mutate(payload, {
      onSuccess: (booking) => {
        if (onSuccess) onSuccess(booking);
        else router.push(`/bookings/${booking.id}`);
      },
    });
  };

  // Derived helpers
  const selectedVehicle  = vehicles.find((v) => v.id === vehicleId) ?? null;
  const totalDays        = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000))
    : selectedPackage?.duration ?? 0;
  const packageCost      = selectedPackage ? selectedPackage.basePrice * numberOfPassengers : 0;
  const vehicleCost      = selectedVehicle ? selectedVehicle.pricePerDay * totalDays : 0;
  const totalCost        = packageCost + vehicleCost;
  const isLast           = step === STEPS.length - 1;

  return (
    <div className="space-y-6">
      <FormStepper steps={STEPS} current={step} onStepClick={(i) => i < step && setStep(i)} />

      {/* ── Step 0 — Your Package ────────────────────────────────── */}
      {step === 0 && (
        <StepCard>
          {pkgLoading && tourPackageId ? (
            <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
          ) : selectedPackage ? (
            /* Package confirmation card */
            <div className="rounded-xl border-2 border-teal-500 bg-teal-50 overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {selectedPackage.images?.[0] ? (
                  <Image src={selectedPackage.images[0]} alt={selectedPackage.name} fill className="object-cover" sizes="600px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 bg-white rounded-full shadow" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 text-lg">{selectedPackage.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{selectedPackage.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedPackage.duration} days</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {selectedPackage.maxCapacity}</span>
                  {selectedPackage.rating != null && (
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{Number(selectedPackage.rating).toFixed(1)}</span>
                  )}
                </div>
                <p className="text-xl font-bold text-teal-700">{formatPrice(selectedPackage.basePrice)}<span className="text-sm text-gray-500 font-normal"> / person</span></p>
              </div>
            </div>
          ) : (
            /* No package selected — redirect prompt */
            <div className="flex flex-col items-center justify-center gap-5 py-10 px-4 text-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-3xl">
                🗺️
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-gray-900">No tour selected yet</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  To book a tour, browse our packages and click the{' '}
                  <span className="inline-flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md px-2 py-0.5 text-xs">
                    Book Now
                  </span>{' '}
                  button on any tour you like.
                </p>
              </div>
              <a
                href="/tours"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Browse Tours →
              </a>
              <FieldError message={errors.tourPackageId} />
            </div>
          )}

          {/* Number of guests */}
          <div>
            <FieldLabel>Number of Guests *</FieldLabel>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setNumberOfPassengers((n) => Math.max(1, n - 1))}
                className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors select-none">−</button>
              <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-lg font-bold text-gray-900">{numberOfPassengers}</span>
                <span className="text-xs text-gray-400">{numberOfPassengers === 1 ? 'guest' : 'guests'}</span>
              </div>
              <button type="button" onClick={() => setNumberOfPassengers((n) => Math.min(selectedPackage?.maxCapacity ?? 99, n + 1))}
                className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors select-none">＋</button>
            </div>
            {selectedPackage && (
              <p className="text-xs text-gray-400 mt-1">Max capacity: {selectedPackage.maxCapacity} guests</p>
            )}
          </div>
        </StepCard>
      )}

      {/* ── Step 1 — Travel Dates ────────────────────────────────── */}
      {step === 1 && (
        <StepCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="bk-start">Start Date *</FieldLabel>
              <Input id="bk-start" type="date" value={startDate} min={tomorrow}
                onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: '' })); }} />
              <FieldError message={errors.startDate} />
            </div>
            <div>
              <FieldLabel htmlFor="bk-end">End Date *{selectedPackage ? ` (auto-filled: ${selectedPackage.duration} days)` : ''}</FieldLabel>
              <Input id="bk-end" type="date" value={endDate} min={startDate || tomorrow}
                onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: '' })); }} />
              <FieldError message={errors.endDate} />
            </div>
          </div>

          {startDate && endDate && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-teal-50 border border-teal-100 text-sm text-teal-800">
              <Clock className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span>{totalDays} day{totalDays !== 1 ? 's' : ''} trip · {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          )}

          <div>
            <FieldLabel htmlFor="bk-requests" hint="Dietary needs, accessibility, special occasions, etc.">Special Requests</FieldLabel>
            <Textarea id="bk-requests" rows={3} placeholder="Any special requirements…" value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)} />
          </div>

          <div>
            <PriceInput id="bk-advance" label="Advance Payment (optional)" hint="Leave at 0 to pay in full later" value={advancePayment} onChange={setAdvancePayment} />
          </div>
        </StepCard>
      )}

      {/* ── Step 2 — Choose a Vehicle ────────────────────────────── */}
      {step === 2 && (
        <StepCard>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Choose a Vehicle <span className="font-normal text-gray-400">(optional)</span></h3>
            <p className="text-xs text-gray-400 mt-0.5">Pick a vehicle for transport during your tour, or skip to continue without one.</p>
          </div>

          {vehiclesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : vehicles.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No vehicles available.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* No vehicle option */}
              <button type="button" onClick={() => setVehicleId('')}
                className={['rounded-xl border-2 p-4 text-center transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]',
                  !vehicleId ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'].join(' ')}>
                <span className="text-3xl">🚶</span>
                <p className="text-sm font-medium text-gray-700">No Vehicle</p>
                <p className="text-xs text-gray-400">I'll arrange my own transport</p>
                {!vehicleId && <CheckCircle className="w-4 h-4 text-teal-600" />}
              </button>

              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} selected={vehicleId === v.id} onSelect={() => setVehicleId(v.id)}
                  available={startDate && endDate ? (availabilityMap[v.id] ?? true) : undefined} />
              ))}
            </div>
          )}

          {vehicleId && selectedVehicle && (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-teal-50 border border-teal-100 text-sm">
              <span className="text-teal-800 font-medium">Selected: {selectedVehicle.name}</span>
              <span className="text-teal-700">{formatPrice(selectedVehicle.pricePerDay)}/day × {totalDays} days = <strong>{formatPrice(vehicleCost)}</strong></span>
            </div>
          )}
        </StepCard>
      )}

      {/* ── Step 3 — Passenger Details ───────────────────────────── */}
      {step === 3 && (
        <StepCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Passengers added</p>
            <span className="text-sm font-semibold text-gray-900">{passengers.length} / {numberOfPassengers}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-teal-500 transition-all duration-300"
              style={{ width: `${(passengers.length / numberOfPassengers) * 100}%` }} />
          </div>

          {passengers.length > 0 && (
            <div className="space-y-2">
              {passengers.map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{p.passengerName}</span>
                    <span className="text-gray-400 ml-2">— {p.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => removePassenger(i)}>Remove</Button>
                </div>
              ))}
            </div>
          )}

          {passengers.length < numberOfPassengers && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Passenger {passengers.length + 1} of {numberOfPassengers}
              </p>
              <PassengerForm onSubmit={addPassenger} onCancel={() => {}} isLoading={false} />
            </div>
          )}
        </StepCard>
      )}

      {/* ── Step 4 — Review & Confirm ────────────────────────────── */}
      {step === 4 && (
        <StepCard>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Booking Summary</h3>

          <div className="rounded-lg border border-gray-200 divide-y divide-gray-100 text-sm">
            {[
              { label: 'Tour Package',     value: selectedPackage?.name ?? tourPackageId },
              { label: 'Vehicle',          value: selectedVehicle?.name ?? 'No vehicle' },
              { label: 'Start Date',       value: new Date(startDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'End Date',         value: new Date(endDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Duration',         value: `${totalDays} day${totalDays !== 1 ? 's' : ''}` },
              { label: 'Guests',           value: `${numberOfPassengers} passenger${numberOfPassengers !== 1 ? 's' : ''}` },
              advancePayment > 0 ? { label: 'Advance Payment', value: formatPrice(advancePayment) } : null,
              specialRequests ? { label: 'Special Requests', value: specialRequests } : null,
            ].filter(Boolean).map((row) => (
              <div key={row!.label} className="flex gap-4 px-4 py-2.5">
                <span className="w-36 shrink-0 text-gray-500">{row!.label}</span>
                <span className="font-medium text-gray-900">{row!.value}</span>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 divide-y divide-gray-100 text-sm">
            <div className="flex justify-between px-4 py-2.5 text-gray-600">
              <span>{selectedPackage?.name ?? 'Package'} × {numberOfPassengers} guests</span>
              <span>{formatPrice(packageCost)}</span>
            </div>
            {vehicleCost > 0 && (
              <div className="flex justify-between px-4 py-2.5 text-gray-600">
                <span>{selectedVehicle?.name} × {totalDays} days</span>
                <span>{formatPrice(vehicleCost)}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-2.5 font-bold text-gray-900">
              <span>Estimated Total</span>
              <span>{formatPrice(totalCost)}</span>
            </div>
          </div>

          {passengers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Passengers ({passengers.length})</p>
              <div className="space-y-1">
                {passengers.map((p, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {i + 1}. {p.passengerName}<span className="text-gray-400 ml-1">— {p.email}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </StepCard>
      )}

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-8">
        <Button variant="secondary" onClick={step === 0 ? (onCancel ?? (() => router.back())) : goBack}>
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>
        {isLast ? (
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Confirming…' : 'Confirm Booking'}
          </Button>
        ) : step === 0 && !selectedPackage ? null : (
          <Button onClick={tryNext}>Next →</Button>
        )}
      </div>
    </div>
  );
}
