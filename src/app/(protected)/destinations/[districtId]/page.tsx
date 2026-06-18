'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDistrictById } from '@/features/destination';
import { DistrictDetail } from '@/features/destination';
import { PackageList } from '@/features/package';

export default function DistrictDetailPage({ params }: { params: { districtId: string } }) {
  const router = useRouter();
  const { data: district, isLoading } = useDistrictById(params.districtId);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!district) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>District not found.</p>
        <button onClick={() => router.push('/destinations')} className="mt-3 text-sm text-green-600 hover:underline">
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
        ← Back to Destinations
      </button>

      <DistrictDetail district={district} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Popular Packages in {district.name}</h2>
          <Link href="/packages" className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All Packages →
          </Link>
        </div>
        <PackageList />
      </section>
    </div>
  );
}
