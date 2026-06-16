'use client';

/**
 * usePermissions
 *
 * Fetches permissions for the current user in the given org.
 * Fail-closed: loading defaults to true until resolved — gates return
 * false (hidden) while loading, preventing unauthorized flashes.
 *
 * Usage:
 *   const { permissions, loading } = usePermissions(currentOrg?.orgId ?? '');
 *   if (loading) return null;
 *   if (!canDoSomething(permissions)) return null;
 */

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

export interface RawPermissions {
  permissions: string[];
  isAdmin: boolean;
}

export function usePermissions(orgId: string) {
  const { data, isLoading } = useQuery<RawPermissions>({
    queryKey: ['permissions', orgId],
    queryFn: async () => {
      const result = await apiRequest(`/permissions?orgId=${orgId}`);
      return result as RawPermissions;
    },
    enabled: !!orgId,
    // Permissions are org-scoped. staleTime: 0 ensures a fresh fetch
    // on every org switch (queryClient.clear() is called on switch).
    staleTime: 0,
  });

  return {
    permissions: data?.permissions ?? [],
    isAdmin: data?.isAdmin ?? false,
    // loading stays true until query resolves — fail-closed guarantee
    loading: isLoading,
  };
}
