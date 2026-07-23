'use client';

import { useAllBookings } from '@/features/booking';
import { usePackages } from '@/features/package';
import { useExperiences } from '@/features/experience';
import { useDistricts } from '@/features/destination';
import { TrendingUp, DollarSign, Calendar, Package, MapPin, Star } from 'lucide-react';

function MetricCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data: bookings, isLoading: bLoading } = useAllBookings({ limit: 100 });
  const { data: packages } = usePackages({ limit: 100 });
  const { data: experiences } = useExperiences();
  const { data: districts } = useDistricts();

  const totalRevenue = bookings.data.reduce((s, b) => s + (b.totalCost ?? 0), 0);
  const paidRevenue = bookings.data.filter(b => b.paymentStatus === 'PAID').reduce((s, b) => s + (b.totalCost ?? 0), 0);
  const confirmedCount = bookings.data.filter(b => b.status === 'CONFIRMED').length;
  const cancelledCount = bookings.data.filter(b => b.status === 'CANCELLED').length;
  const completedCount = bookings.data.filter(b => b.status === 'COMPLETED').length;

  const statusBreakdown: { label: string; count: number; color: string }[] = [
    { label: 'Pending', count: bookings.data.filter(b => b.status === 'PENDING').length, color: 'bg-yellow-400' },
    { label: 'Confirmed', count: confirmedCount, color: 'bg-green-400' },
    { label: 'Completed', count: completedCount, color: 'bg-blue-400' },
    { label: 'Cancelled', count: cancelledCount, color: 'bg-red-400' },
  ];

  const topPackages = [...packages.data]
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 5);

  const featuredExperiences = experiences.filter(e => e.featured).slice(0, 5);
  const featuredDistricts = districts.filter(d => d.featured).slice(0, 5);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Total Bookings" value={bLoading ? '…' : bookings.total} icon={Calendar} color="bg-blue-500" />
        <MetricCard label="Total Revenue" value={bLoading ? '…' : `$${totalRevenue.toLocaleString()}`} sub={`$${paidRevenue.toLocaleString()} collected`} icon={DollarSign} color="bg-green-500" />
        <MetricCard label="Completed Tours" value={bLoading ? '…' : completedCount} icon={TrendingUp} color="bg-purple-500" />
        <MetricCard label="Active Packages" value={packages.data.filter(p => p.status === 'ACTIVE').length} icon={Package} color="bg-orange-500" />
        <MetricCard label="Destinations" value={districts.length} sub={`${districts.filter(d => d.featured).length} featured`} icon={MapPin} color="bg-red-500" />
        <MetricCard label="Experiences" value={experiences.length} sub={`${experiences.filter(e => e.featured).length} featured`} icon={Star} color="bg-yellow-500" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Booking Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statusBreakdown.map(s => (
            <div key={s.label} className="text-center">
              <div className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold text-sm">{s.count}</span>
              </div>
              <p className="text-xs text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Most Booked Packages</h2>
          {topPackages.length === 0
            ? <p className="text-sm text-gray-400">No data.</p>
            : <ul className="space-y-2">
                {topPackages.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category} · {p.duration}d</p>
                    </div>
                    <span className="text-xs text-gray-500">{p.reviewCount ?? 0} reviews</span>
                  </li>
                ))}
              </ul>
          }
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Popular Destinations</h2>
          {featuredDistricts.length === 0
            ? <p className="text-sm text-gray-400">No featured destinations.</p>
            : <ul className="space-y-2">
                {featuredDistricts.map((d, i) => (
                  <li key={d.id} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <p className="text-sm text-gray-800 flex-1">{d.name}</p>
                    <span className="text-xs text-gray-400">{d.attractions?.length ?? 0} attractions</span>
                  </li>
                ))}
              </ul>
          }
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Popular Experiences</h2>
          {featuredExperiences.length === 0
            ? <p className="text-sm text-gray-400">No featured experiences.</p>
            : <ul className="space-y-2">
                {featuredExperiences.map((e, i) => (
                  <li key={e.id} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{e.name}</p>
                      <p className="text-xs text-gray-400">{e.category}</p>
                    </div>
                    <span className="text-xs text-gray-500">${Number(e.price).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
          }
        </div>
      </div>
    </div>
  );
}
