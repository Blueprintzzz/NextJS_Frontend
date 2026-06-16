'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExample } from '../api/example.api';
import type { ExampleItem, CreateExamplePayload } from '../types/example.types';

export function useCreateExample(orgId: string) {
  const queryClient = useQueryClient();
  const key = ['example', 'items', orgId];

  return useMutation({
    mutationFn: (payload: CreateExamplePayload) => createExample(payload),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: key });
      const snapshot = queryClient.getQueryData<ExampleItem[]>(key);
      queryClient.setQueryData<ExampleItem[]>(key, (old = []) => [
        ...old,
        { ...newItem, id: 'temp', createdAt: new Date().toISOString() },
      ]);
      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(key, context?.snapshot);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
