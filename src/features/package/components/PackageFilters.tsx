'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../utils/package.utils';
import type { PackageCategory } from '../types/package.types';

interface Filters {
  search: string;
  category?: PackageCategory;
  minPrice: string;
  maxPrice: string;
  minDuration: string;
  maxDuration: string;
}

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
}

export function PackageFilters({ value, onChange }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...value, [k]: v });

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Search</label>
        <Input
          placeholder="Search packages..."
          value={value.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-2">Category</label>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => set('category', undefined)}
            className={`text-left px-2 py-1 rounded text-sm ${!value.category ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            All Categories
          </button>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => set('category', c)}
              className={`text-left px-2 py-1 rounded text-sm ${value.category === c ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Price Range (USD)</label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" value={value.minPrice} onChange={(e) => set('minPrice', e.target.value)} />
          <Input type="number" placeholder="Max" value={value.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Duration (days)</label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" value={value.minDuration} onChange={(e) => set('minDuration', e.target.value)} />
          <Input type="number" placeholder="Max" value={value.maxDuration} onChange={(e) => set('maxDuration', e.target.value)} />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => onChange({ search: '', category: undefined, minPrice: '', maxPrice: '', minDuration: '', maxDuration: '' })}
      >
        Clear Filters
      </Button>
    </div>
  );
}
