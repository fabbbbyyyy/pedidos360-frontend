import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { CenteredMessage } from '@/design-system/templates';
import { SessionProvider } from './SessionProvider';

// Guard de AUTENTICACIÓN: ¿hay sesión? Si no, manda a /login recordando a dónde iba.
// Todo lo que cuelgue de esta ruta en el router queda protegido.
export function RequireAuth() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const location = useLocation();

  if (inProgress !== InteractionStatus.None) {
    return <CenteredMessage title="Iniciando sesión…" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
}
