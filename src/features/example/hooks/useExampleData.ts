'use client';

import { useQuery } from '@tanstack/react-query';
import { getExamples } from '../api/example.api';

export function useExampleData(orgId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['example', 'items', orgId],
    queryFn: () => getExamples(orgId),
    enabled: !!orgId,
  });
  return { data: data ?? [], isLoading, isError };
}
