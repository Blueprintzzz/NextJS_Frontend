'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExperienceForm } from '@/features/experience';

export default function CreateExperiencePage() {
  const searchParams  = useSearchParams();
  const returnTo      = searchParams.get('returnTo');
  const fromPackages  = returnTo === '/packages/create';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={returnTo ?? '/admin/experiences'}>
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Create Experience</h1>
          <p className="text-sm text-gray-400">
            {fromPackages
              ? "Create a new experience — you'll return to your package after saving."
              : 'Fill in the details below to publish a new experience.'}
          </p>
        </div>
        {/* Context pill — shown only when coming from packages */}
        {fromPackages && (
          <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 flex-shrink-0">
            ✨ Adding to package itinerary
          </span>
        )}
      </div>

      {/* Form — redirectTo prop stays as-is; ExperienceForm reads
          ?returnTo internally and overrides when present */}
      <ExperienceForm redirectTo="/admin/experiences" />
    </div>
  );
}
