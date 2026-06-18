'use client';

import { getCategoryColor, getAttractionCategoryLabel } from '../utils/destination.utils';
import type { AttractionCategory } from '../types/destination.types';

const ALL_CATEGORIES: AttractionCategory[] = [
  'TEMPLE', 'BEACH', 'MOUNTAIN', 'WATERFALL', 'HISTORIC', 'WILDLIFE',
];

interface Props {
  selected?: AttractionCategory;
  onChange: (cat?: AttractionCategory) => void;
}

export function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(undefined)}
        className={`px-3 py-1 rounded-full text-sm border transition-colors ${!selected ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600 hover:border-gray-500'}`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === selected ? undefined : cat)}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${selected === cat ? 'bg-gray-900 text-white border-gray-900' : `${getCategoryColor(cat)} border-transparent`}`}
        >
          {getAttractionCategoryLabel(cat)}
        </button>
      ))}
    </div>
  );
}
