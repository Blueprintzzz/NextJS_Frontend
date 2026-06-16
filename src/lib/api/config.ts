/**
 * config.ts
 *
 * API layer configuration.
 * Single source of truth for the backend base URL.
 *
 * NEXT_PUBLIC_API_URL replaces V1's VITE_API_URL.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
