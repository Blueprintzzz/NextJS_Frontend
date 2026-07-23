'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  type: 'destination' | 'experience' | 'vehicle';
  name: string;
  price: number;
}

function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('gaman_cart') ?? '[]'); } catch { return []; }
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.user.user);
  const [items] = useState<CartItem[]>(getCart);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce((s, i) => s + i.price, 0);
  const destinations = items.filter((i) => i.type === 'destination');
  const experiences = items.filter((i) => i.type === 'experience');
  const vehicle = items.find((i) => i.type === 'vehicle');

  const handleConfirm = async () => {
    if (!name.trim() || !email.trim() || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/bookings/customized', {
        method: 'POST',
        body: JSON.stringify({
          travelerName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          startDate,
          endDate,
          numberOfPassengers: passengers,
          specialRequests: notes.trim(),
          destinations: destinations.map((d) => d.id),
          experiences: experiences.map((e) => e.id),
          vehicleId: vehicle?.id,
          estimatedTotal: total,
        }),
      });
      localStorage.removeItem('gaman_cart');
      toast.success('Booking confirmed!');
      router.push('/bookings');
    } catch {
      toast.error('Failed to confirm booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/tourist/cart"><Button className="mt-4">Go to Cart</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tourist/cart"><button className="text-sm text-gray-500 hover:text-gray-700">← Back to Cart</button></Link>
        <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Traveler details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Traveler Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email *</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 000 0000" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Passengers</label>
                <Input type="number" min={1} max={50} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Start Date *</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">End Date *</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Special Requests</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Dietary requirements, accessibility needs, etc." />
            </div>
          </div>

          {/* Payment note */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
            <p className="font-medium">💳 Payment</p>
            <p className="text-xs mt-1">Online payment will be available soon. Your booking will be confirmed and a driver will contact you with payment details.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 h-fit space-y-4">
          <h2 className="font-semibold text-gray-900">Booking Summary</h2>
          <div className="space-y-2">
            {destinations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Destinations</p>
                {destinations.map((d) => (
                  <div key={d.id} className="flex justify-between text-sm text-gray-700">
                    <span className="truncate">{d.name}</span>
                    <span className="flex-shrink-0 ml-2">${d.price}</span>
                  </div>
                ))}
              </div>
            )}
            {experiences.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 mt-2">Experiences</p>
                {experiences.map((e) => (
                  <div key={e.id} className="flex justify-between text-sm text-gray-700">
                    <span className="truncate">{e.name}</span>
                    <span className="flex-shrink-0 ml-2">${e.price}</span>
                  </div>
                ))}
              </div>
            )}
            {vehicle && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 mt-2">Vehicle</p>
                <div className="flex justify-between text-sm text-gray-700">
                  <span className="truncate">{vehicle.name}</span>
                  <span className="flex-shrink-0 ml-2">${vehicle.price}</span>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
            <span>Estimated Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">Final price set after driver offer</p>
          <Button className="w-full" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Confirming…' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
}
