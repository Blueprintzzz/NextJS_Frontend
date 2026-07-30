'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { DistrictDetail, useDestinationById } from '@/features/destination';

export default function DestinationDetailPage() {
  const { districtId } = useParams<{ districtId: string }>();
  const { data: district, isLoading, isError } = useDestinationById(districtId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-20 rounded bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (isError || !district) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Destination Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn&apos;t find the destination you&apos;re looking for.</p>
        <Link href="/destinations" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Back to Destinations
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          All Destinations
        </Link>
      </nav>
      <DistrictDetail district={district} />
    </main>
  );
}
