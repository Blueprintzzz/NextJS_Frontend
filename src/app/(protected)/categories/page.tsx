'use client';

import Link from 'next/link';
import { useCategories } from '@/features/destination';
import type { TourCategoryName } from '@/features/destination';

const CATEGORY_ICONS: Record<TourCategoryName, string> = {
  ADVENTURE: '🧗',
  NATURE: '🌿',
  ROMANTIC: '💕',
  WILDLIFE: '🐘',
  FAMILY: '👨‍👩‍👧‍👦',
  CULTURAL: '🏛️',
  BEACH: '🏖️',
  LUXURY: '✨',
};

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore Tour Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Find tours that match your travel style</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.name.toLowerCase()}`}
              className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-green-300 transition-all group"
            >
              <div className="text-4xl mb-3">{CATEGORY_ICONS[cat.name] ?? '🗺️'}</div>
              <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                {cat.name.charAt(0) + cat.name.slice(1).toLowerCase()}
              </h2>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
