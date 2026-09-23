import { BrowserRouter } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { msalInstance } from '@/core/auth/msalInstance';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

export default function AppProviders({ children }) {
  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </MsalProvider>
  );
}
