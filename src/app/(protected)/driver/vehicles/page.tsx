'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus, CalendarCheck } from 'lucide-react';
import { useDriverVehicles, useDeleteVehicle } from '@/features/vehicle';

export default function DriverVehiclesPage() {
  const router = useRouter();
  const { data, isLoading } = useDriverVehicles();
  const deleteMutation = useDeleteVehicle();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
        <button
          onClick={() => router.push('/driver/vehicles/create')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No vehicles yet</p>
          <p className="text-sm mt-1">Add your first vehicle to start accepting bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-100">
                {v.images[0] ? (
                  <Image src={v.images[0]} alt={v.vehicleModelName ?? v.registrationNumber} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🚗</div>
                )}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {v.status}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900">{v.vehicleModelName ?? v.registrationNumber}</p>
                <p className="text-xs text-gray-400">{v.registrationNumber}</p>
                <p className="text-sm text-gray-500">{v.type} · {v.capacity} seats · ${v.pricePerDay}/day</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/driver/vehicles/${v.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => router.push(`/driver/vehicles/${v.id}/availability`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" /> Availability
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this vehicle?')) deleteMutation.mutate(v.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
