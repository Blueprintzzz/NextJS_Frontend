/**
 * request.ts
 *
 * Core fetch wrapper for all JSON API requests.
 *
 * Preserves V1 apiRequest() behaviour exactly:
 *   - Injects auth + org headers via buildJsonHeaders()
 *   - On 401/403: checks if error body contains token-related message,
 *     falls back to baseToken, retries once (retryWithBaseToken flag
 *     prevents infinite recursion)
 *   - On non-OK response: parses error body, throws ApiError
 *   - On 204 / empty body: returns null
 *   - On success: returns parsed JSON
 */

import { API_BASE_URL } from './config';
import { buildJsonHeaders } from './headers';
import { ApiError, parseErrorResponse } from './errors';
import { getAuthToken, updateActiveToken } from './storeContext';
import { localStorageGetJSON } from '@/lib/utils/localStorage';

interface RawUserData {
  baseToken?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Core request function
// ---------------------------------------------------------------------------

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  retryWithBaseToken = true
): Promise<unknown> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = buildJsonHeaders(
    endpoint,
    options.headers as Record<string, string> | undefined
  );

  const response = await fetch(url, { ...options, headers });

  // -------------------------------------------------------------------------
  // 401 / 403 — attempt baseToken retry (mirrors V1 exactly)
  // -------------------------------------------------------------------------
  if ((response.status === 401 || response.status === 403) && retryWithBaseToken) {
    try {
      const errorText = await response.clone().text();

      if (
        errorText.includes('Invalid or expired token') ||
        errorText.includes('Unauthorized')
      ) {
        const userData = localStorageGetJSON<RawUserData>('user') ?? {};
        const baseToken = userData.baseToken;
        const currentToken = getAuthToken();

        if (baseToken && baseToken !== currentToken) {
          // Update token in store + localStorage, then retry once
          updateActiveToken(baseToken);
          return apiRequest(endpoint, options, false);
        }
      }
    } catch {
      // Parsing failed — fall through to error handling below
    }
  }

  // -------------------------------------------------------------------------
  // Non-OK response — parse and throw
  // -------------------------------------------------------------------------
  if (!response.ok) {
    const message = await parseErrorResponse(response);
    throw new ApiError(message, response.status, response.statusText);
  }

  // -------------------------------------------------------------------------
  // Empty response (204 No Content or zero content-length)
  // -------------------------------------------------------------------------
  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return null;
  }

  return response.json() as Promise<unknown>;
}
