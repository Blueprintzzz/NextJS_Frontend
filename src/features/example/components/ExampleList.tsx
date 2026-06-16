'use client';

// Replace with your domain component

import type { ExampleItem } from '../types/example.types';

interface ExampleListProps {
  items: ExampleItem[];
  isLoading: boolean;
}

export function ExampleList({ items, isLoading }: ExampleListProps) {
  if (isLoading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="h-12 rounded-md bg-gray-100 animate-pulse" />
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No items found.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-md border border-gray-200 px-4 py-3">
          <p className="font-medium text-gray-900">{item.name}</p>
          {item.description && (
            <p className="text-sm text-gray-500">{item.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
