/**
 * config.ts
 *
 * API layer configuration.
 * Single source of truth for the backend base URL.
 *
 * NEXT_PUBLIC_API_URL replaces V1's VITE_API_URL.
 * Trailing slash is stripped so callers can always use a leading-slash
 * path (e.g. apiRequest('/packages')) without producing double slashes.
 */

const raw = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export const API_URL = raw.replace(/\/+$/, '');
