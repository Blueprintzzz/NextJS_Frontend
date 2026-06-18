'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AttractionList } from '@/features/destination';
import { PackageCard, usePackagesByCategory } from '@/features/package';
import type { AttractionCategory } from '@/features/destination';
import type { PackageCategory } from '@/features/package';

const TOUR_TO_ATTRACTION: Partial<Record<string, AttractionCategory>> = {
  beach: 'BEACH',
  wildlife: 'WILDLIFE',
  cultural: 'TEMPLE',
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const displayName = params.category.charAt(0).toUpperCase() + params.category.slice(1).toLowerCase();
  const pkgCategory = params.category.toUpperCase() as PackageCategory;
  const attractionCat = TOUR_TO_ATTRACTION[params.category] as AttractionCategory | undefined;

  const { data: packages, isLoading: pkgsLoading } = usePackagesByCategory(pkgCategory);

  return (
    <div className="p-6 space-y-10">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
        ← Back
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{displayName} Tours</h1>
        <p className="text-sm text-gray-500 mt-1">Explore all {displayName} destinations and attractions</p>
      </div>

      {attractionCat && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Attractions</h2>
          <AttractionList category={attractionCat} paginated />
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Related Packages</h2>
          <Link href={`/packages?category=${pkgCategory}`} className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All Packages →
          </Link>
        </div>
        {pkgsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <p className="text-sm text-gray-500">No packages found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.slice(0, 8).map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        )}
      </section>
    </div>
  );
}
