'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBookingById } from '../hooks/useBookingData';
import { useUpdateBooking } from '../hooks/useUpdateBooking';
import type { Booking, CreateBookingInput } from '../types/booking.types';

interface EditBookingFormProps {
  bookingId: string;
  onSuccess?: (booking: Booking) => void;
}

const today = new Date().toISOString().split('T')[0];

export function EditBookingForm({ bookingId, onSuccess }: EditBookingFormProps) {
  const router = useRouter();
  const { data: booking, isLoading } = useBookingById(bookingId);
  const mutation = useUpdateBooking();

  const [vehicleId, setVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (booking) {
      setVehicleId(booking.vehicleId ?? '');
      setStartDate(booking.startDate.split('T')[0]);
      setEndDate(booking.endDate.split('T')[0]);
      setNumberOfPassengers(booking.numberOfPassengers);
      setSpecialRequests(booking.specialRequests ?? '');
    }
  }, [booking]);

  if (isLoading) return <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />;
  if (!booking) return <p className="text-sm text-red-600">Booking not found.</p>;

  const locked = booking.status === 'CONFIRMED' || booking.status === 'COMPLETED';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!startDate) e.startDate = 'Required';
    if (!endDate) e.endDate = 'Required';
    if (startDate && endDate && startDate >= endDate) e.endDate = 'End must be after start';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload: Partial<CreateBookingInput> = {
      vehicleId: vehicleId || undefined,
      specialRequests: specialRequests || undefined,
      ...(!locked && { startDate, endDate, numberOfPassengers }),
    };
    mutation.mutate({ id: bookingId, data: payload }, {
      onSuccess: (updated) => {
        if (onSuccess) onSuccess(updated);
        else router.push(`/bookings/${bookingId}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Vehicle ID</label>
        <Input value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} placeholder="Optional" />
      </div>
      <div>
        <label className="text-sm font-medium">Start Date</label>
        <Input type="date" value={startDate} min={today} disabled={locked} onChange={(e) => setStartDate(e.target.value)} />
        {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">End Date</label>
        <Input type="date" value={endDate} min={startDate || today} disabled={locked} onChange={(e) => setEndDate(e.target.value)} />
        {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Number of Passengers</label>
        <Input type="number" min={1} value={numberOfPassengers} disabled={locked} onChange={(e) => setNumberOfPassengers(parseInt(e.target.value) || 1)} />
      </div>
      <div>
        <label className="text-sm font-medium">Special Requests</label>
        <Textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3} />
      </div>
      {locked && <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">Dates and passenger count are locked for {booking.status.toLowerCase()} bookings.</p>}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={() => router.push(`/bookings/${bookingId}`)}>Cancel</Button>
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving…' : 'Save Changes'}</Button>
      </div>
    </form>
  );
}
