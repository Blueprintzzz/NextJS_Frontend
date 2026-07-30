import { getAuthToken } from './storeContext';

export type HeadersRecord = Record<string, string>;

/** Convenience helper for feature API calls that need auth headers. */
export function getAuthHeaders(): HeadersRecord {
  const token = getAuthToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export function buildJsonHeaders(
  _endpoint: string,
  callerHeaders: HeadersRecord = {}
): HeadersRecord {
  const headers: HeadersRecord = {
    'Content-Type': 'application/json',
    ...callerHeaders,
  };

  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // TODO: re-enable when backend is ready to accept these headers
  // const user = getCurrentUserData();
  // if (user.email) headers['x-user-email'] = user.email as string;
  // if (orgId) headers['x-selected-org-id'] = orgId;
  // if (orgId) headers['x-org-id'] = orgId;
  // if (orgId) headers['x-organization-id'] = orgId;

  return headers;
}

export function buildMultipartHeaders(_endpoint: string): HeadersRecord {
  const headers: HeadersRecord = {};

  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // TODO: re-enable when backend is ready to accept these headers
  // const user = getCurrentUserData();
  // if (user.email) headers['x-user-email'] = user.email as string;

  return headers;
}
