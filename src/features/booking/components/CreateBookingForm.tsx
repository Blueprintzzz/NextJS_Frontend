'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStepper } from '@/components/shared/FormStepper';
import { PriceInput } from '@/components/shared/PriceInput';
import { PassengerForm } from './PassengerForm';
import { useCreateBooking } from '../hooks/useCreateBooking';
import type { Booking, CreateBookingInput, CreatePassengerInput } from '../types/booking.types';

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Tour & Vehicle',      description: 'Package & vehicle IDs' },
  { label: 'Dates & Passengers',  description: 'Travel dates & group size' },
  { label: 'Passenger Details',   description: 'Individual traveller info' },
  { label: 'Review & Submit',     description: 'Confirm your booking' },
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

interface CreateBookingFormProps {
  onSuccess?: (booking: Booking) => void;
  onCancel?: () => void;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  const isRequired = typeof children === 'string' && children.endsWith(' *');
  const text = isRequired ? (children as string).slice(0, -2) : children;
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {text}
        {isRequired && <span className="text-red-500 ml-0.5">*</span>}
      </label>
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

// ─── Main component ───────────────────────────────────────────────────────────
export function CreateBookingForm({ onSuccess, onCancel }: CreateBookingFormProps) {
  const router   = useRouter();
  const mutation = useCreateBooking();
  const [step, setStep] = useState(0);

  // Form state
  const [tourPackageId,       setTourPackageId]       = useState('');
  const [vehicleId,           setVehicleId]           = useState('');
  const [startDate,           setStartDate]           = useState('');
  const [endDate,             setEndDate]             = useState('');
  const [numberOfPassengers,  setNumberOfPassengers]  = useState(1);
  const [advancePayment,      setAdvancePayment]      = useState<number>(0);
  const [specialRequests,     setSpecialRequests]     = useState('');
  const [passengers,          setPassengers]          = useState<CreatePassengerInput[]>([]);
  const [errors,              setErrors]              = useState<Record<string, string>>({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!tourPackageId.trim())
        e.tourPackageId = 'Tour package ID is required.';
      else if (!UUID_RE.test(tourPackageId.trim()))
        e.tourPackageId = 'Must be a valid UUID (e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890).';
      if (vehicleId && !UUID_RE.test(vehicleId.trim()))
        e.vehicleId = 'Must be a valid UUID.';
    }
    if (step === 1) {
      if (!startDate)  e.startDate = 'Start date is required.';
      if (!endDate)    e.endDate   = 'End date is required.';
      if (startDate && endDate && startDate >= endDate)
        e.endDate = 'End date must be after start date.';
      if (startDate && startDate < tomorrow)
        e.startDate = 'Start date must be in the future.';
      if (numberOfPassengers < 1)
        e.numberOfPassengers = 'At least 1 passenger is required.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const tryNext = () => { if (validate()) setStep((s) => s + 1); };
  const goBack  = () => { setErrors({}); setStep((s) => s - 1); };

  // ── Passenger helpers ───────────────────────────────────────────────────────
  const addPassenger    = (data: CreatePassengerInput) => setPassengers((p) => [...p, data]);
  const removePassenger = (i: number) => setPassengers((p) => p.filter((_, idx) => idx !== i));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const payload: CreateBookingInput = {
      tourPackageId,
      vehicleId:        vehicleId || undefined,
      startDate:        new Date(startDate + 'T12:00:00.000Z').toISOString(),
      endDate:          new Date(endDate   + 'T12:00:00.000Z').toISOString(),
      numberOfPassengers,
      advancePayment:   advancePayment > 0 ? advancePayment : undefined,
      specialRequests:  specialRequests || undefined,
      passengers,
    };
    mutation.mutate(payload, {
      onSuccess: (booking) => {
        if (onSuccess) onSuccess(booking);
        else router.push(`/bookings/${booking.id}`);
      },
    });
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

      {/* ── Step 0 — Tour & Vehicle ──────────────────────────────── */}
      {step === 0 && (
        <StepCard>
          <div>
            <FieldLabel htmlFor="bk-pkg">Tour Package ID *</FieldLabel>
            <Input
              id="bk-pkg"
              placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
              value={tourPackageId}
              onChange={(e) => { setTourPackageId(e.target.value); setErrors((p) => ({ ...p, tourPackageId: '' })); }}
            />
            <FieldError message={errors.tourPackageId} />
          </div>

          <div>
            <FieldLabel htmlFor="bk-vehicle" hint="Leave blank if no specific vehicle is needed">Vehicle ID</FieldLabel>
            <Input
              id="bk-vehicle"
              placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890 (optional)"
              value={vehicleId}
              onChange={(e) => { setVehicleId(e.target.value); setErrors((p) => ({ ...p, vehicleId: '' })); }}
            />
            <FieldError message={errors.vehicleId} />
          </div>
        </StepCard>
      )}

      {/* ── Step 1 — Dates & Passengers ─────────────────────────── */}
      {step === 1 && (
        <StepCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="bk-start">Start Date *</FieldLabel>
              <Input
                id="bk-start"
                type="date"
                value={startDate}
                min={tomorrow}
                onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: '' })); }}
              />
              <FieldError message={errors.startDate} />
            </div>
            <div>
              <FieldLabel htmlFor="bk-end">End Date *</FieldLabel>
              <Input
                id="bk-end"
                type="date"
                value={endDate}
                min={startDate || tomorrow}
                onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: '' })); }}
              />
              <FieldError message={errors.endDate} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel htmlFor="bk-pax">Number of Passengers *</FieldLabel>
              <Input
                id="bk-pax"
                type="number"
                min={1}
                value={numberOfPassengers}
                onChange={(e) => { setNumberOfPassengers(parseInt(e.target.value) || 1); setErrors((p) => ({ ...p, numberOfPassengers: '' })); }}
              />
              <FieldError message={errors.numberOfPassengers} />
            </div>
            <div>
              <PriceInput
                id="bk-advance"
                label="Advance Payment"
                hint="Leave at 0 to pay in full later"
                value={advancePayment}
                onChange={setAdvancePayment}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="bk-requests" hint="Dietary needs, accessibility, special occasions, etc.">Special Requests</FieldLabel>
            <Textarea
              id="bk-requests"
              rows={3}
              placeholder="Any special requirements…"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>
        </StepCard>
      )}

      {/* ── Step 2 — Passenger Details ───────────────────────────── */}
      {step === 2 && (
        <StepCard>
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Passengers added
            </p>
            <span className="text-sm font-semibold text-gray-900">
              {passengers.length} / {numberOfPassengers}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${(passengers.length / numberOfPassengers) * 100}%` }}
            />
          </div>

          {/* Added passengers */}
          {passengers.length > 0 && (
            <div className="space-y-2">
              {passengers.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-900">{p.passengerName}</span>
                    <span className="text-gray-400 ml-2">— {p.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removePassenger(i)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add next passenger */}
          {passengers.length < numberOfPassengers && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Passenger {passengers.length + 1} of {numberOfPassengers}
              </p>
              <PassengerForm
                onSubmit={addPassenger}
                onCancel={() => {}}
                isLoading={false}
              />
            </div>
          )}
        </StepCard>
      )}

      {/* ── Step 3 — Review & Submit ─────────────────────────────── */}
      {step === 3 && (
        <StepCard>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Booking Summary</h3>

          <div className="rounded-lg border border-gray-200 bg-gray-50 divide-y divide-gray-100 text-sm">
            {[
              { label: 'Tour Package',  value: tourPackageId },
              vehicleId ? { label: 'Vehicle',        value: vehicleId }   : null,
              { label: 'Start Date',    value: startDate },
              { label: 'End Date',      value: endDate },
              { label: 'Passengers',    value: String(numberOfPassengers) },
              advancePayment > 0 ? { label: 'Advance Payment', value: `$${advancePayment.toFixed(2)}` } : null,
              specialRequests ? { label: 'Special Requests', value: specialRequests } : null,
            ]
              .filter(Boolean)
              .map((row) => (
                <div key={row!.label} className="flex gap-4 px-4 py-2.5">
                  <span className="w-36 shrink-0 text-gray-500">{row!.label}</span>
                  <span className="font-medium text-gray-900 break-all">{row!.value}</span>
                </div>
              ))}
          </div>

          {passengers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Passengers ({passengers.length})
              </p>
              <div className="space-y-1">
                {passengers.map((p, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {i + 1}. {p.passengerName}
                    <span className="text-gray-400 ml-1">— {p.email}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </StepCard>
      )}

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-8">
        <Button
          variant="secondary"
          onClick={step === 0 ? (onCancel ?? (() => router.back())) : goBack}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>

        {isLast ? (
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Confirm Booking'}
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
