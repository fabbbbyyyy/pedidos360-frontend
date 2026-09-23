import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/core/api/useApiClient';
import { createCatalogApi } from '../api/catalogApi';

export const CATALOG_KEY = ['catalog'];

function useCatalogApi() {
  const http = useApiClient();
  return useMemo(() => createCatalogApi(http), [http]);
}

export function useProducts() {
  const api = useCatalogApi();
  return useQuery({ queryKey: CATALOG_KEY, queryFn: api.list });
}

export function useCreateProduct() {
  const api = useCatalogApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATALOG_KEY }),
  });
}

export function useUpdateProduct() {
  const api = useCatalogApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...changes }) => api.update(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATALOG_KEY }),
  });
}

export function useDeleteProduct() {
  const api = useCatalogApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATALOG_KEY }),
  });
}
