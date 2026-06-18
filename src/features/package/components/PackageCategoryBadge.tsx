'use client';

import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/package.utils';
import type { PackageCategory } from '../types/package.types';

interface Props {
  category: PackageCategory;
}

export function PackageCategoryBadge({ category }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[category]}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
