'use client';

import { ExampleList, useExampleData } from '@/features/example';

export default function ExamplePage() {
  return <ExamplePageContent />;
}

function ExamplePageContent() {
  const { data, isLoading, isError } = useExampleData('');

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Example Feature</h1>

      {isError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          Failed to load data.
        </p>
      )}

      <ExampleList items={data} isLoading={isLoading} />
    </div>
  );
}
