import type { ExampleItem } from '../types/example.types';

// Add domain-specific pure utils here

export function formatExampleItem(item: ExampleItem): string {
  return `${item.name} (${item.createdAt})`;
}
