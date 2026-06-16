/**
 * headers.ts
 *
 * Header construction for API requests.
 *
 * Preserves V1 header injection behaviour exactly:
 *   - Authorization: Bearer <token>
 *   - x-user-email: <email>
 *   - x-selected-org-id: <orgId>   ┐
 *   - x-org-id: <orgId>            ├ all three injected for non-auth endpoints
 *   - x-organization-id: <orgId>   ┘
 *
 * Auth endpoints (/auth/*) skip org headers EXCEPT /auth/profile.
 */

import {
  getAuthToken,
  getSelectedOrgId,
  getCurrentUserData,
} from './storeContext';

export type HeadersRecord = Record<string, string>;

/**
 * Determine whether org-scoped headers should be injected for this endpoint.
 * Mirrors V1 condition: !endpoint.startsWith('/auth/') || endpoint === '/auth/profile'
 */
function shouldInjectOrgHeaders(endpoint: string): boolean {
  return !endpoint.startsWith('/auth/') || endpoint === '/auth/profile';
}

/**
 * Build the full headers object for a JSON API request.
 * Merges caller-supplied headers last so they can override defaults.
 */
export function buildJsonHeaders(
  endpoint: string,
  callerHeaders: HeadersRecord = {}
): HeadersRecord {
  const headers: HeadersRecord = {
    'Content-Type': 'application/json',
    ...callerHeaders,
  };

  // Authorization
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // User email — for organisation filtering on the backend
  const user = getCurrentUserData();
  if (user.email) {
    headers['x-user-email'] = user.email as string;
  }

  // Org-scoped headers
  if (shouldInjectOrgHeaders(endpoint)) {
    const orgId = getSelectedOrgId();
    if (orgId) {
      headers['x-selected-org-id'] = orgId;
      headers['x-org-id'] = orgId;
      headers['x-organization-id'] = orgId;
    }
  }

  return headers;
}

/**
 * Build headers for multipart/form-data requests (file uploads).
 * Content-Type is intentionally omitted — the browser sets it with
 * the correct boundary when body is FormData.
 */
export function buildMultipartHeaders(endpoint: string): HeadersRecord {
  const headers: HeadersRecord = {};

  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const user = getCurrentUserData();
  if (user.email) headers['x-user-email'] = user.email as string;

  if (shouldInjectOrgHeaders(endpoint)) {
    const orgId = getSelectedOrgId();
    if (orgId) {
      headers['x-selected-org-id'] = orgId;
      headers['x-org-id'] = orgId;
      headers['x-organization-id'] = orgId;
    }
  }

  return headers;
}
