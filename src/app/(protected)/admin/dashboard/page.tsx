'use client';

import { useAllBookings } from '@/features/booking';
import { usePackages } from '@/features/package';
import { useExperiences } from '@/features/experience';
import { useDistricts } from '@/features/destination';
import { Users, Car, Package, Star, MapPin, Calendar, TrendingUp, DollarSign } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: bookings, isLoading: bLoading } = useAllBookings();
  const { data: packages, isLoading: pLoading } = usePackages();
  const { data: experiences, isLoading: eLoading } = useExperiences();
  const { data: districts } = useDistricts();

  const totalRevenue = bookings.data.reduce((sum, b) => sum + (b.totalCost ?? 0), 0);
  const confirmedBookings = bookings.data.filter(b => b.status === 'CONFIRMED').length;
  const activePackages = packages.data.filter(p => p.status === 'ACTIVE').length;
  const featuredExperiences = experiences.filter(e => e.featured).length;

  const recentBookings = [...bookings.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={bLoading ? '…' : bookings.total} icon={Calendar} color="bg-teal-500" />
        <StatCard label="Active Packages" value={pLoading ? '…' : activePackages} icon={Package} color="bg-green-500" />
        <StatCard label="Total Revenue" value={bLoading ? '…' : `$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-yellow-500" />
        <StatCard label="Confirmed Bookings" value={bLoading ? '…' : confirmedBookings} icon={TrendingUp} color="bg-purple-500" />
        <StatCard label="Destinations" value={districts.length} icon={MapPin} color="bg-red-500" />
        <StatCard label="Experiences" value={eLoading ? '…' : experiences.length} icon={Star} color="bg-orange-500" />
        <StatCard label="Featured Experiences" value={eLoading ? '…' : featuredExperiences} icon={Star} color="bg-pink-500" />
        <StatCard label="Total Packages" value={pLoading ? '…' : packages.total} icon={Car} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          {bLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : recentBookings.length === 0 ? (
            <p className="text-sm text-gray-500">No bookings yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-gray-500 border-b">{['#', 'Passengers', 'Total', 'Status'].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map(b => (
                  <tr key={b.id}>
                    <td className="py-2 pr-4 font-mono text-xs text-gray-600">{b.bookingNumber}</td>
                    <td className="py-2 pr-4 text-gray-700">{b.numberOfPassengers}</td>
                    <td className="py-2 pr-4 text-gray-700">${b.totalCost.toLocaleString()}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Popular Destinations</h2>
          {districts.length === 0 ? (
            <p className="text-sm text-gray-500">No destinations found.</p>
          ) : (
            <ul className="space-y-2">
              {districts.slice(0, 6).map(d => (
                <li key={d.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-800">{d.name}</span>
                  {d.featured && <span className="px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700">Featured</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Manage Users', href: '/admin/users', icon: Users },
            { label: 'Manage Bookings', href: '/admin/bookings', icon: Calendar },
            { label: 'Manage Packages', href: '/admin/packages', icon: Package },
            { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
          ].map(({ label, href, icon: Icon }) => (
            <a key={href} href={href} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors text-center">
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
