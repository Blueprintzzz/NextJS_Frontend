/**
 * can.ts
 *
 * Domain permission helpers.
 * Add your own below — always fail-closed (return false on unknown permissions).
 *
 * Pattern:
 *   export const canDoSomething = (permissions: string[]): boolean =>
 *     permissions.includes('resource:action');
 *
 * Usage in a component:
 *   const { permissions, loading } = usePermissions(orgId);
 *   if (loading) return null;
 *   if (!canDoSomething(permissions)) return null;
 */

// Stub helpers — replace with real permission strings from your backend
export const canDoSomething = (_permissions: string[]): boolean => false;
export const canDoSomethingElse = (_permissions: string[]): boolean => false;
