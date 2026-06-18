'use client';

import { useRouter } from 'next/navigation';
import { VehicleList } from '@/features/vehicle';
import { useAppSelector } from '@/store/hooks';

export default function VehiclesPage() {
  const router = useRouter();
  const role = useAppSelector((s) => s.user.role);
  const isAdmin = role === 'ADMIN';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">Choose the perfect vehicle for your tour</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => router.push('/admin/vehicles/create')}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            + Create Vehicle
          </button>
        )}
      </div>
      <VehicleList onSelect={(v) => router.push(`/vehicles/${v.id}`)} />
    </div>
  );
}
