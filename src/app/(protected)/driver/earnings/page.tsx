'use client';

import { DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { useBookingData, formatCurrency, formatBookingNumber } from '@/features/booking';

function groupByMonth(bookings: { createdAt: string; totalCost: number }[]) {
  const map: Record<string, number> = {};
  bookings.forEach((b) => {
    const key = new Date(b.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
    map[key] = (map[key] ?? 0) + b.totalCost;
  });
  return Object.entries(map).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).reverse();
}

export default function DriverEarningsPage() {
  const { data, isLoading } = useBookingData({ status: 'COMPLETED', limit: 100 });

  const totalRevenue = data.data.reduce((sum, b) => sum + (b.totalCost ?? 0), 0);
  const monthlyData = groupByMonth(data.data);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-50 text-green-600"><DollarSign className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-teal-50 text-teal-600"><CheckCircle className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{data.total}</p>
            <p className="text-sm text-gray-500">Completed Bookings</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {data.total > 0 ? formatCurrency(totalRevenue / data.total) : '—'}
            </p>
            <p className="text-sm text-gray-500">Avg. per Booking</p>
          </div>
        </div>
      </div>

      {/* Monthly income report */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Monthly Income Report</h2>
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 rounded bg-gray-100 animate-pulse" />)}</div>
        ) : monthlyData.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No completed bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {monthlyData.map(([month, amount]) => (
              <div key={month} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-700">{month}</span>
                <span className="text-sm font-semibold text-green-700">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed bookings table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Completed Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Booking #', 'Date', 'Passengers', 'Amount'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 4 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                : data.data.length === 0
                ? <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No completed bookings.</td></tr>
                : data.data.map((b) => (
                    <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-teal-700">{formatBookingNumber(b.bookingNumber)}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(b.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{b.numberOfPassengers}</td>
                      <td className="px-4 py-3 font-semibold text-green-700">{formatCurrency(b.totalCost)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
