'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useBookingData } from '@/features/booking/hooks/useBookingData';
import { BookingStatusBadge } from '@/features/booking/components/BookingStatusBadge';
import { formatCurrency } from '@/features/booking/utils/booking.utils';

export default function TouristDashboardPage() {
  const user = useAppSelector((s) => s.user.user);
  const { data: bookingsData, isLoading } = useBookingData({ limit: 5 });

  const upcoming = bookingsData.data.filter((b) =>
    b.status === 'CONFIRMED' && new Date(b.startDate) >= new Date()
  );
  const recent = bookingsData.data.slice(0, 3);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white">
        <p className="text-teal-100 text-sm">Welcome back</p>
        <h1 className="text-2xl font-bold mt-1">{user?.name ?? 'Traveller'} 👋</h1>
        <p className="text-teal-100 text-sm mt-1">{user?.email}</p>
        <div className="flex gap-3 mt-4">
          <Link href="/tours/customize" className="bg-white text-teal-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors">
            Plan a Tour
          </Link>
          <Link href="/tours" className="border border-white/40 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">
            Browse Packages
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookingsData.total, href: '/bookings' },
          { label: 'Upcoming Trips', value: upcoming.length, href: '/bookings' },
          { label: 'Completed Tours', value: bookingsData.data.filter(b => b.status === 'COMPLETED').length, href: '/bookings' },
          { label: 'My Reviews', value: '—', href: '/account/reviews' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming trips */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Upcoming Trips</h2>
            <Link href="/bookings" className="text-xs text-teal-600 hover:underline">View all</Link>
          </div>
          {isLoading && <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>}
          {!isLoading && upcoming.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No upcoming trips</p>
              <Link href="/tours" className="text-teal-600 text-sm font-medium hover:underline mt-2 inline-block">Browse tours →</Link>
            </div>
          )}
          {!isLoading && upcoming.map((b) => (
            <Link key={b.id} href={`/bookings/${b.id}`} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800">{b.bookingNumber}</p>
                <p className="text-xs text-gray-400">{new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}</p>
              </div>
              <BookingStatusBadge status={b.status} />
            </Link>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/bookings" className="text-xs text-teal-600 hover:underline">View all</Link>
          </div>
          {isLoading && <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>}
          {!isLoading && recent.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>}
          {!isLoading && recent.map((b) => (
            <Link key={b.id} href={`/bookings/${b.id}`} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800">{b.bookingNumber}</p>
                <p className="text-xs text-gray-400">{formatCurrency(b.totalCost)} · {b.numberOfPassengers} pax</p>
              </div>
              <BookingStatusBadge status={b.status} />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'My Profile', href: '/tourist/profile', icon: '👤' },
          { label: 'Recommendations', href: '/tourist/recommendations', icon: '✨' },
          { label: 'My Cart', href: '/tourist/cart', icon: '🛒' },
          { label: 'Notifications', href: '/tourist/notifications', icon: '🔔' },
        ].map((link) => (
          <Link key={link.label} href={link.href} className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-sm hover:border-teal-200 transition-all">
            <span className="text-2xl">{link.icon}</span>
            <p className="text-xs font-medium text-gray-700 mt-2">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
