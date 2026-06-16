/**
 * Safe localStorage helpers.
 *
 * All localStorage access in this codebase must go through these helpers.
 * They guard against the server environment where localStorage is undefined,
 * which would otherwise crash Next.js during SSR / static generation.
 */

export function localStorageGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function localStorageSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently ignore — storage quota or private-mode restrictions
  }
}

export function localStorageRemove(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}

export function localStorageGetJSON<T>(key: string): T | null {
  const raw = localStorageGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function localStorageSetJSON(key: string, value: unknown): void {
  try {
    localStorageSet(key, JSON.stringify(value));
  } catch {
    // Silently ignore serialisation errors
  }
}
