'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  type: 'destination' | 'experience' | 'vehicle';
  name: string;
  price: number;
  image?: string;
  meta?: string;
}

// Cart is managed client-side (localStorage) until backend cart API is available
function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('gaman_cart') ?? '[]'); } catch { return []; }
  });

  const save = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem('gaman_cart', JSON.stringify(next));
  };

  const remove = (id: string) => {
    save(items.filter((i) => i.id !== id));
    toast.success('Item removed');
  };

  const clear = () => { save([]); toast.success('Cart cleared'); };

  return { items, remove, clear };
}

const TYPE_ICON: Record<CartItem['type'], string> = {
  destination: '📍',
  experience: '🎭',
  vehicle: '🚗',
};

const TYPE_LABEL: Record<CartItem['type'], string> = {
  destination: 'Destination',
  experience: 'Experience',
  vehicle: 'Vehicle',
};

export default function CartPage() {
  const { items, remove, clear } = useCart();

  const destinations = items.filter((i) => i.type === 'destination');
  const experiences = items.filter((i) => i.type === 'experience');
  const vehicles = items.filter((i) => i.type === 'vehicle');
  const total = items.reduce((sum, i) => sum + i.price, 0);

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center py-20">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-xl font-semibold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500 text-sm mt-2">Add destinations, experiences, or a vehicle to get started</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/destinations"><Button variant="outline">Browse Destinations</Button></Link>
          <Link href="/experiences"><Button variant="outline">Browse Experiences</Button></Link>
          <Link href="/tours/customize"><Button>Plan a Tour</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">My Cart</h1>
        <Button variant="ghost" size="sm" onClick={clear} className="text-red-500 hover:text-red-600">Clear all</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { label: 'Destinations', list: destinations },
            { label: 'Experiences', list: experiences },
            { label: 'Vehicle', list: vehicles },
          ].map(({ label, list }) => list.length > 0 && (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <h2 className="font-medium text-gray-700 text-sm mb-3">{label}</h2>
              <div className="space-y-3">
                {list.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : TYPE_ICON[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{TYPE_LABEL[item.type]}{item.meta ? ` · ${item.meta}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-900">${item.price.toLocaleString()}</span>
                      <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 h-fit space-y-4">
          <h2 className="font-semibold text-gray-900">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Destinations ({destinations.length})</span>
              <span>${destinations.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Experiences ({experiences.length})</span>
              <span>${experiences.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Vehicle ({vehicles.length})</span>
              <span>${vehicles.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-gray-900">
              <span>Estimated Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">Final price confirmed after driver offer selection</p>
          <Link href="/tourist/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
          <Link href="/tours/customize" className="block text-center text-xs text-teal-600 hover:underline">
            Continue planning →
          </Link>
        </div>
      </div>
    </div>
  );
}
