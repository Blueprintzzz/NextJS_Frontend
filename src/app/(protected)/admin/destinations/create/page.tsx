'use client';

import { useRouter } from 'next/navigation';
import { CreateDestinationForm } from '@/features/destination';

export default function AdminCreateDestinationPage() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-4">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900">Add Destination</h1>
      <CreateDestinationForm />
    </div>
  );
}
