'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PassengerForm } from './PassengerForm';
import { useCreateBooking } from '../hooks/useCreateBooking';
import type { Booking, CreateBookingInput, CreatePassengerInput } from '../types/booking.types';

interface CreateBookingFormProps {
  onSuccess?: (booking: Booking) => void;
  onCancel?: () => void;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const STEPS = ['Tour & Vehicle', 'Dates & Passengers', 'Passenger Details', 'Review & Submit'];

export function CreateBookingForm({ onSuccess, onCancel }: CreateBookingFormProps) {
  const router = useRouter();
  const mutation = useCreateBooking();
  const [step, setStep] = useState(0);

  const [tourPackageId, setTourPackageId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [advancePayment, setAdvancePayment] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [passengers, setPassengers] = useState<CreatePassengerInput[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!tourPackageId.trim()) e.tourPackageId = 'Tour package ID is required';
      else if (!UUID_RE.test(tourPackageId.trim())) e.tourPackageId = 'Must be a valid UUID (e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890)';
      if (vehicleId && !UUID_RE.test(vehicleId.trim())) e.vehicleId = 'Must be a valid UUID';
    }
    if (step === 1) {
      if (!startDate) e.startDate = 'Start date required';
      if (!endDate) e.endDate = 'End date required';
      if (startDate && endDate && startDate >= endDate) e.endDate = 'End date must be after start date';
      if (startDate && startDate < tomorrow) e.startDate = 'Start date must be in the future';
      if (numberOfPassengers < 1) e.numberOfPassengers = 'At least 1 passenger required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const handleAddPassenger = (data: CreatePassengerInput) => setPassengers((prev) => [...prev, data]);
  const handleRemovePassenger = (i: number) => setPassengers((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    const payload: CreateBookingInput = {
      tourPackageId,
      vehicleId: vehicleId || undefined,
      startDate: new Date(startDate + 'T12:00:00.000Z').toISOString(),
      endDate: new Date(endDate + 'T12:00:00.000Z').toISOString(),
      numberOfPassengers,
      advancePayment: advancePayment ? parseFloat(advancePayment) : undefined,
      specialRequests: specialRequests || undefined,
      passengers,
    };
    mutation.mutate(payload, {
      onSuccess: (booking) => {
        if (onSuccess) onSuccess(booking);
        else router.push(`/bookings/${booking.id}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex-1 text-center">
            <div className={`h-2 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <p className={`text-xs mt-1 ${i === step ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>{label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {step === 0 && (
            <>
              <div>
                <label className="text-sm font-medium">Tour Package ID *</label>
                <Input value={tourPackageId} onChange={(e) => setTourPackageId(e.target.value)} placeholder="Tour package ID" />
                {errors.tourPackageId && <p className="text-xs text-red-500 mt-1">{errors.tourPackageId}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Vehicle ID (optional)</label>
                <Input value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} placeholder="Vehicle ID" />
                {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium">Start Date *</label>
                <Input type="date" value={startDate} min={tomorrow} onChange={(e) => setStartDate(e.target.value)} />
                {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">End Date *</label>
                <Input type="date" value={endDate} min={startDate || tomorrow} onChange={(e) => setEndDate(e.target.value)} />
                {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Number of Passengers *</label>
                <Input type="number" min={1} value={numberOfPassengers} onChange={(e) => setNumberOfPassengers(parseInt(e.target.value) || 1)} />
                {errors.numberOfPassengers && <p className="text-xs text-red-500 mt-1">{errors.numberOfPassengers}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Advance Payment (optional)</label>
                <Input type="number" min="0" step="0.01" value={advancePayment} onChange={(e) => setAdvancePayment(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium">Special Requests</label>
                <Textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requirements…" rows={3} />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{passengers.length} of {numberOfPassengers} passengers added</p>
              {passengers.map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-2 text-sm">
                  <span>{p.passengerName} — {p.email}</span>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleRemovePassenger(i)}>Remove</Button>
                </div>
              ))}
              {passengers.length < numberOfPassengers && (
                <PassengerForm
                  onSubmit={handleAddPassenger}
                  onCancel={() => {}}
                  isLoading={false}
                />
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-sm">
              <h3 className="font-semibold text-gray-800">Review your booking</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <span>Tour Package:</span><span className="font-medium text-gray-900">{tourPackageId}</span>
                {vehicleId && <><span>Vehicle:</span><span className="font-medium text-gray-900">{vehicleId}</span></>}
                <span>Start:</span><span className="font-medium text-gray-900">{startDate}</span>
                <span>End:</span><span className="font-medium text-gray-900">{endDate}</span>
                <span>Passengers:</span><span className="font-medium text-gray-900">{numberOfPassengers}</span>
                {advancePayment && <><span>Advance:</span><span className="font-medium text-gray-900">${advancePayment}</span></>}
              </div>
              <div>
                <p className="font-medium mb-1">Passenger list ({passengers.length})</p>
                {passengers.map((p, i) => <p key={i} className="text-gray-600">{i + 1}. {p.passengerName}</p>)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={step === 0 ? onCancel : back}>
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Confirm Booking'}
          </Button>
        )}
      </div>
    </div>
  );
}
