'use client';

import { ALL_CATEGORIES, CATEGORY_LABELS } from '../utils/package.utils';
import type { PackageCategory } from '../types/package.types';

interface Props {
  selected?: PackageCategory;
  onChange: (c: PackageCategory | undefined) => void;
}

export function PackageCategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(undefined)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(selected === c ? undefined : c)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {CATEGORY_LABELS[c]}
        </button>
      ))}
    </div>
  );
}
