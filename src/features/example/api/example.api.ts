/**
 * example.api.ts
 *
 * Feature-level API wrappers for the example domain.
 *
 * Rule: reads never throw (return [] on failure).
 *       writes always throw (let useMutation onError fire).
 *
 * Replace '/examples' with your real endpoint path.
 */

import { apiRequest } from '@/lib/api';
import type { ExampleItem, CreateExamplePayload } from '../types/example.types';

// Read — never throws
export async function getExamples(orgId: string): Promise<ExampleItem[]> {
  try {
    const raw = await apiRequest(`/examples?orgId=${orgId}`);
    return Array.isArray(raw) ? (raw as ExampleItem[]) : [];
  } catch {
    return [];
  }
}

// Write — always throws so useMutation.onError fires
export async function createExample(payload: CreateExamplePayload): Promise<ExampleItem> {
  return apiRequest('/examples', {
    method: 'POST',
    body: JSON.stringify(payload),
  }) as Promise<ExampleItem>;
}
