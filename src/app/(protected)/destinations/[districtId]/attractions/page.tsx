'use client';

import { use } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AttractionList, CategoryFilter, useDistrictById } from '@/features/destination';
import type { AttractionCategory } from '@/features/destination';

export default function DistrictAttractionsPage({ params }: { params: Promise<{ districtId: string }> }) {
  const { districtId } = use(params);
  const router = useRouter();
  const { data: district } = useDistrictById(districtId);
  const [category, setCategory] = useState<AttractionCategory | undefined>();

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
        ← Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900">
        {district ? `${district.name} — All Attractions` : 'All Attractions'}
      </h1>
      <CategoryFilter selected={category} onChange={setCategory} />
      <AttractionList districtId={districtId} category={category} paginated />
    </div>
  );
}
