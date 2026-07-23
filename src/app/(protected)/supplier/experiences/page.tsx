'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExperienceList } from '@/features/experience';

export default function SupplierExperiencesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My Experiences</h1>
        <Link href="/supplier/experiences/create">
          <Button>+ New Experience</Button>
        </Link>
      </div>
      <ExperienceList editBasePath="/supplier/experiences" readonlyFeatured />
    </div>
  );
}
