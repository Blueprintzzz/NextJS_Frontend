'use client';

import Link from 'next/link';
import { Car, Calendar, DollarSign, Package, Star, Clock } from 'lucide-react';
import { useVehicles } from '@/features/vehicle';
import { usePackages } from '@/features/package';
import { useBookingData } from '@/features/booking';

export default function DriverDashboardPage() {
  const { data: vehicles } = useVehicles();
  const { data: packages } = usePackages({ limit: 5 });
  const { data: bookings } = useBookingData({ limit: 5, status: 'CONFIRMED' });
  const { data: upcoming } = useBookingData({ limit: 5, status: 'PENDING' });

  const stats = [
    { label: 'My Vehicles', value: vehicles.length, icon: Car, href: '/driver/vehicles', color: 'bg-teal-50 text-teal-600' },
    { label: 'Active Packages', value: packages.data.length, icon: Package, href: '/driver/packages', color: 'bg-green-50 text-green-600' },
    { label: 'Confirmed Tours', value: bookings.data.length, icon: Calendar, href: '/driver/bookings', color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Requests', value: upcoming.data.length, icon: Clock, href: '/driver/booking-requests', color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>

      {/* Stats */}
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
        {/* Upcoming Tours */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Upcoming Tours</h2>
            <Link href="/driver/bookings" className="text-sm text-teal-600 hover:underline">View all</Link>
          </div>
          {bookings.data.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No upcoming tours.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {bookings.data.slice(0, 4).map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="font-mono text-teal-700">{b.bookingNumber}</span>
                  <span className="text-gray-500">{new Date(b.startDate).toLocaleDateString()}</span>
                  <span className="text-gray-600">{b.numberOfPassengers} pax</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Package Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Package Performance</h2>
            <Link href="/driver/packages" className="text-sm text-teal-600 hover:underline">View all</Link>
          </div>
          {packages.data.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No packages yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {packages.data.slice(0, 4).map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800 truncate max-w-[160px]">{p.name}</span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    {p.rating ?? '—'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Vehicle Status</h2>
            <Link href="/driver/vehicles" className="text-sm text-teal-600 hover:underline">Manage</Link>
          </div>
          {vehicles.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No vehicles registered.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {vehicles.slice(0, 4).map((v) => (
                <li key={v.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{v.name}</span>
                  <span className="text-gray-500">{v.type} · {v.capacity} seats</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {v.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Revenue Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue Summary</h2>
            <Link href="/driver/earnings" className="text-sm text-teal-600 hover:underline">Details</Link>
          </div>
          <div className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${bookings.data.reduce((sum, b) => sum + (b.totalCost ?? 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">From {bookings.data.length} confirmed bookings</p>
            </div>
          </div>
          <Link href="/driver/earnings" className="block text-center text-sm text-teal-600 hover:underline mt-2">
            View full earnings report →
          </Link>
        </div>
      </div>
    </div>
  );
}
