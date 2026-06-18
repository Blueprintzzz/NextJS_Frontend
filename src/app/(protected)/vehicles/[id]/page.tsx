'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useVehicleById, useDeleteVehicle, VehicleDetail } from '@/features/vehicle';
import { useAppSelector } from '@/store/hooks';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const role = useAppSelector((s) => s.user.role);
  const isAdmin = role === 'ADMIN';
  const { data: vehicle, isLoading } = useVehicleById(id);
  const deleteMutation = useDeleteVehicle();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Vehicle not found.</p>
        <button onClick={() => router.push('/vehicles')} className="mt-3 text-sm text-green-600 hover:underline">
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
          ← Back
        </button>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/admin/vehicles/${id}/edit`)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this vehicle?')) {
                  deleteMutation.mutate(vehicle.id, { onSuccess: () => router.push('/vehicles') });
                }
              }}
              className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <VehicleDetail vehicle={vehicle} onSelect={() => router.push('/bookings/create')} />
    </div>
  );
}
