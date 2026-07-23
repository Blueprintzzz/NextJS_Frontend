'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ExperienceForm } from '@/features/experience';

export default function DriverEditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  return (
    <div className="p-6 space-y-4">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900">Edit Experience</h1>
      <ExperienceForm experienceId={id} redirectTo="/driver/experiences" />
    </div>
  );
}
