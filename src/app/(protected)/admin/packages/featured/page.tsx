'use client';

import { FeaturedPackagesCarousel } from '@/features/package';

export default function FeaturedPackagesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Featured Packages</h1>
      <FeaturedPackagesCarousel />
    </div>
  );
}
