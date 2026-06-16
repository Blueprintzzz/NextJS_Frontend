// This is a template for new feature pages.
// Copy this file to app/(protected)/<your-feature>/page.tsx and rename accordingly.

'use client';

import { useAppSelector } from '@/store/hooks';
import { usePermissions } from '@/features/permissions';
import { ExampleList, useExampleData } from '@/features/example';

export default function ExamplePage() {
  const orgId = useAppSelector((s) => s.user.currentOrg?.orgId ?? '');

  // Permission gate — fail-closed: returns null while loading.
  // usePermissions() reads currentOrg from Redux internally.
  const { loading: permLoading } = usePermissions();
  if (permLoading) return null;

  // Uncomment to gate this page once you have a can* helper:
  // import { canDoSomething } from '@/features/permissions';
  // if (!canDoSomething(permissions)) {
  //   return <p className="p-8 text-sm text-gray-500">Access denied.</p>;
  // }

  return <ExamplePageContent orgId={orgId} />;
}

// Inner component runs hooks only after permission check passes
function ExamplePageContent({ orgId }: { orgId: string }) {
  const { data, isLoading, isError } = useExampleData(orgId);

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
