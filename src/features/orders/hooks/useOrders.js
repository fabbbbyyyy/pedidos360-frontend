import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/core/auth/SessionProvider';
import { useApiClient } from '@/core/api/useApiClient';
import { createOrdersApi } from '../api/ordersApi';

export const ORDERS_KEY = ['orders'];

function useOrdersQueryKey() {
  const { account } = useSession();
  return [...ORDERS_KEY, account.homeAccountId];
}

function useOrdersApi() {
  const http = useApiClient();
  return useMemo(() => createOrdersApi(http), [http]);
}

export function useOrders() {
  const api = useOrdersApi();
  const queryKey = useOrdersQueryKey();
  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await api.list({ limit: 25, cursor: pageParam });
      if (Array.isArray(response)) return { items: response, nextCursor: null };
      return { items: response?.items ?? [], nextCursor: response?.nextCursor ?? null };
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
  return {
    ...query,
    data: query.data?.pages.flatMap((page) => page.items) ?? [],
  };
}

export function useOrder(id) {
  const api = useOrdersApi();
  const { account } = useSession();
  return useQuery({
    queryKey: ['order', account.homeAccountId, id],
    queryFn: () => api.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const api = useOrdersApi();
  const queryClient = useQueryClient();
  const queryKey = useOrdersQueryKey();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['catalog'] }); // el backend descuenta stock al crear
    },
    onError: (error) => {
      if (error.status === 409) queryClient.invalidateQueries({ queryKey: ['catalog'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const api = useOrdersApi();
  const queryClient = useQueryClient();
  const queryKey = useOrdersQueryKey();
  return useMutation({
    mutationFn: ({ id, status, expectedVersion }) => api.updateStatus(id, status, expectedVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
}

export function useDeleteOrder() {
  const api = useOrdersApi();
  const queryClient = useQueryClient();
  const queryKey = useOrdersQueryKey();
  return useMutation({
    mutationFn: api.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
    },
  });
}
