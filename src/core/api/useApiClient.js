import { useMemo } from 'react';
import { useMsal } from '@azure/msal-react';
import { env } from '@/core/config/env';
import { acquireApiToken } from '@/core/auth/acquireApiToken';
import { createHttpClient } from './httpClient';

// Cliente HTTP que adjunta el Bearer token de la API en cada llamada.
export function useApiClient() {
  const { instance, accounts } = useMsal();

  return useMemo(
    () =>
      createHttpClient({
        baseUrl: env.apiBaseUrl,
        getToken: () => {
          const account = accounts[0] ?? instance.getActiveAccount();
          if (!account) throw new Error('No hay una cuenta activa');
          return acquireApiToken(instance, account);
        },
      }),
    [instance, accounts],
  );
}
