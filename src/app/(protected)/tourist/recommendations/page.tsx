'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
import { apiRequest } from '@/lib/api';

type Tab = 'destinations' | 'experiences' | 'vehicles';

interface RecommendedItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  images?: string[];
  price?: number;
  pricePerDay?: number;
  capacity?: number;
  type?: string;
  category?: string;
}

function ItemCard({ item, href, badge }: { item: RecommendedItem; href: string; badge?: string }) {
  const img = item.images?.[0];
  const name = item.name ?? item.title ?? 'Unnamed';
  const price = item.price ?? item.pricePerDay;
  return (
    <Link href={href} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-40 bg-gray-100">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🗺️</div>
        )}
        {badge && <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-900 text-sm">{name}</p>
        {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          {item.type ?? item.category ? <span className="capitalize">{item.type ?? item.category}</span> : null}
          {price != null && <span className="text-teal-600 font-medium">${price}</span>}
          {item.capacity != null && <span>👥 {item.capacity}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function RecommendationsPage() {
  const orgId = useAppSelector((s) => s.user.userId ?? '');
  const [tab, setTab] = useState<Tab>('destinations');

  const { data: destinations = [], isLoading: loadingDest } = useQuery<RecommendedItem[]>({
    queryKey: ['recommendations', 'destinations', orgId],
    queryFn: async () => {
      try { return (await apiRequest('/destinations/recommended')) as RecommendedItem[]; } catch { return []; }
    },
    enabled: tab === 'destinations',
  });

  const { data: experiences = [], isLoading: loadingExp } = useQuery<RecommendedItem[]>({
    queryKey: ['recommendations', 'experiences', orgId],
    queryFn: async () => {
      try { return (await apiRequest('/experiences/recommended')) as RecommendedItem[]; } catch { return []; }
    },
    enabled: tab === 'experiences',
  });

  const { data: vehicles = [], isLoading: loadingVeh } = useQuery<RecommendedItem[]>({
    queryKey: ['recommendations', 'vehicles', orgId],
    queryFn: async () => {
      try { return (await apiRequest('/vehicles/recommended')) as RecommendedItem[]; } catch { return []; }
    },
    enabled: tab === 'vehicles',
  });

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'destinations', label: 'Destinations', icon: '📍' },
    { key: 'experiences', label: 'Experiences', icon: '🎭' },
    { key: 'vehicles', label: 'Vehicles', icon: '🚗' },
  ];

  const isLoading = tab === 'destinations' ? loadingDest : tab === 'experiences' ? loadingExp : loadingVeh;
  const items = tab === 'destinations' ? destinations : tab === 'experiences' ? experiences : vehicles;
  const hrefBase = tab === 'destinations' ? '/destinations' : tab === 'experiences' ? '/experiences' : '/vehicles';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">AI Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">Personalised suggestions based on your travel preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300'}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Vehicle recommendation hint */}
      {tab === 'vehicles' && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-700">
          <p className="font-medium">Smart Vehicle Matching</p>
          <p className="text-xs mt-1 text-teal-600">Suggestions are based on passenger count, route distance, and comfort level. 2 pax → Car · 5 pax → SUV · 8 pax → KDH Van · 15+ pax → Mini Bus</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">✨</p>
          <p className="font-medium">No recommendations yet</p>
          <p className="text-sm mt-1">Complete a booking to get personalised suggestions</p>
          <Link href="/tours" className="mt-4 inline-block text-teal-600 text-sm font-medium hover:underline">Browse tours →</Link>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <ItemCard key={item.id} item={item} href={`${hrefBase}/${item.id}`} badge={i === 0 ? 'Top Pick' : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
