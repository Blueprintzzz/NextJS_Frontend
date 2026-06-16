'use client';

import { useAppSelector } from '@/store/hooks';
import { usePermissions as useLibPermissions } from '@/lib/permissions';
export { canDoSomething, canDoSomethingElse } from '@/lib/permissions';

// UserPermissions is string[] — the resolved permissions array
export type UserPermissions = string[];

/**
 * No-arg wrapper around lib/permissions usePermissions.
 * Reads currentOrg from Redux internally so callers don't need to pass orgId.
 */
export function usePermissions() {
  const orgId = useAppSelector((s) => s.user.currentOrg?.orgId ?? '');
  return useLibPermissions(orgId);
}
