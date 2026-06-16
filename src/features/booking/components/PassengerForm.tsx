'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreatePassengerInput, BookingPassenger } from '../types/booking.types';
import { validatePassenger } from '../utils/booking.utils';

interface PassengerFormProps {
  onSubmit: (data: CreatePassengerInput) => void;
  onCancel: () => void;
  initialData?: BookingPassenger;
  isLoading?: boolean;
}

const EMPTY: CreatePassengerInput = { passengerName: '', email: '', phone: '', dateOfBirth: '', passportNumber: '' };

export function PassengerForm({ onSubmit, onCancel, initialData, isLoading }: PassengerFormProps) {
  const [form, setForm] = useState<CreatePassengerInput>(
    initialData
      ? { passengerName: initialData.passengerName, email: initialData.email, phone: initialData.phone, dateOfBirth: initialData.dateOfBirth, passportNumber: initialData.passportNumber }
      : EMPTY
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: keyof CreatePassengerInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validatePassenger(form);
    if (errs.length) {
      setErrors(Object.fromEntries(errs.map((e) => [e.field, e.message])));
      return;
    }
    setErrors({});
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full Name *</label>
        <Input value={form.passengerName} onChange={set('passengerName')} placeholder="Full name" />
        {errors.passengerName && <p className="text-xs text-red-500 mt-1">{errors.passengerName}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Email *</label>
        <Input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Phone *</label>
        <Input value={form.phone} onChange={set('phone')} placeholder="+1234567890" />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Date of Birth *</label>
        <Input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} max={new Date().toISOString().split('T')[0]} />
        {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Passport Number</label>
        <Input value={form.passportNumber ?? ''} onChange={set('passportNumber')} placeholder="Optional" />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving…' : 'Save Passenger'}</Button>
      </div>
    </form>
  );
}
