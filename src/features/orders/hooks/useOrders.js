import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/core/api/useApiClient';
import { createOrdersApi } from '../api/ordersApi';

export const ORDERS_KEY = ['orders'];

function useOrdersApi() {
  const http = useApiClient();
  return useMemo(() => createOrdersApi(http), [http]);
}

export function useOrders() {
  const api = useOrdersApi();
  return useQuery({ queryKey: ORDERS_KEY, queryFn: api.list });
}

export function useCreateOrder() {
  const api = useOrdersApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: ['catalog'] }); // el backend descuenta stock al crear
    },
  });
}

export function useUpdateOrderStatus() {
  const api = useOrdersApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => api.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

export function useDeleteOrder() {
  const api = useOrdersApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}
