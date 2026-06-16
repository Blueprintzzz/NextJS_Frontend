/**
 * errors.ts
 *
 * Normalised API error type and response parsing.
 *
 * V1 threw plain Error objects with a message string extracted from the
 * response. V2 preserves that behaviour but adds a typed ApiError class
 * that carries the HTTP status code for callers that need to branch on it.
 */

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

// ---------------------------------------------------------------------------
// Response parsing
// ---------------------------------------------------------------------------

/**
 * Extract a human-readable error message from a failed Response.
 * Mirrors V1 error parsing logic exactly.
 */
export async function parseErrorResponse(
  response: Response
): Promise<string> {
  const fallback = `HTTP ${response.status}: ${response.statusText}`;
  try {
    const text = await response.text();
    if (!text) return fallback;
    try {
      const json = JSON.parse(text) as Record<string, unknown>;
      return (
        (json.message as string | undefined) ??
        (json.error as string | undefined) ??
        fallback
      );
    } catch {
      return text || fallback;
    }
  } catch {
    return fallback;
  }
}
