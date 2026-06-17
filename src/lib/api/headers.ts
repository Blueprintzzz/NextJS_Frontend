import { getAuthToken } from './storeContext';

// TODO: re-enable getCurrentUserData when backend is ready to accept custom headers
// import { getCurrentUserData } from './storeContext';

export type HeadersRecord = Record<string, string>;

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
