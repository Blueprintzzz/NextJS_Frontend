'use client';

import Link from 'next/link';
import { Briefcase, Calendar, DollarSign, Star } from 'lucide-react';
import { useExperiences } from '@/features/experience';
import { useBookingData } from '@/features/booking';

export default function SupplierDashboardPage() {
  const { data: experiences } = useExperiences();
  const { data: bookings } = useBookingData({ status: 'CONFIRMED', limit: 5 });
  const { data: completed } = useBookingData({ status: 'COMPLETED', limit: 100 });

  const totalEarnings = completed.data.reduce((sum, b) => sum + (b.totalCost ?? 0), 0);
  const avgRating =
    experiences.length > 0
      ? (
          experiences.reduce((sum, e) => sum + Number(e.rating ?? 0), 0) / experiences.length
        ).toFixed(1)
      : '—';

  const stats = [
    { label: 'My Experiences', value: experiences.length, icon: Briefcase, href: '/supplier/experiences', color: 'bg-teal-50 text-teal-600' },
    { label: 'Active Bookings', value: bookings.data.length, icon: Calendar, href: '/supplier/bookings', color: 'bg-green-50 text-green-600' },
    { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, href: '/supplier/bookings', color: 'bg-purple-50 text-purple-600' },
    { label: 'Avg. Rating', value: avgRating, icon: Star, href: '/supplier/experiences', color: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Experiences */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Experiences</h2>
            <Link href="/supplier/experiences" className="text-sm text-teal-600 hover:underline">View all</Link>
          </div>
          {experiences.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No experiences yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {experiences.slice(0, 5).map((e) => (
                <li key={e.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800 truncate max-w-[160px]">{e.name}</span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    {e.rating ?? '—'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/supplier/bookings" className="text-sm text-teal-600 hover:underline">View all</Link>
          </div>
          {bookings.data.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No active bookings.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {bookings.data.slice(0, 5).map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="font-mono text-teal-700">{b.bookingNumber}</span>
                  <span className="text-gray-500">{new Date(b.startDate).toLocaleDateString()}</span>
                  <span className="text-gray-600">{b.numberOfPassengers} pax</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
