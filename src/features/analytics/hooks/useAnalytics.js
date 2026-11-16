import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/core/auth/SessionProvider';
import { useApiClient } from '@/core/api/useApiClient';
import { createAnalyticsApi } from '../api/analyticsApi';

export const ANALYTICS_KEY = ['analytics'];

export function useAnalytics() {
  const http = useApiClient();
  const { account } = useSession();
  const api = useMemo(() => createAnalyticsApi(http), [http]);

  return useQuery({
    queryKey: [...ANALYTICS_KEY, account.homeAccountId],
    queryFn: api.get,
    staleTime: 15_000,
    refetchInterval: 5_000,
  });
}
