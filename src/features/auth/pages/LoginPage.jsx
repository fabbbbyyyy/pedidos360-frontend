import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from '@/core/auth/authConfig';
import { Button, IconMicrosoft } from '@/design-system/atoms';
import { Notice } from '@/design-system/molecules';
import { AuthGateLayout } from '@/design-system/templates';

export default function LoginPage() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname ?? '/dashboard';

  if (isAuthenticated && inProgress === InteractionStatus.None) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = () => {
    setError(null);
    instance
      .loginRedirect({ ...loginRequest, redirectStartPage: window.location.origin + from })
      .catch(() => setError('No pudimos iniciar sesión. Inténtalo nuevamente o contacta a soporte.'));
  };

  return (
    <AuthGateLayout
      title="Inicia sesión"
      lead="Usa tu cuenta de la empresa para consultar el catálogo, crear pedidos y seguir su estado."
      action={
        <>
          <Button variant="primary" block onClick={handleLogin} disabled={inProgress !== InteractionStatus.None}>
            <IconMicrosoft />
            Iniciar sesión
          </Button>
          {error && <div style={{ marginTop: 12 }}><Notice variant="error">{error}</Notice></div>}
        </>
      }
      footer={
        <>
          ¿Tienes problemas para acceder? Contacta a soporte interno.
        </>
      }
    />
  );
}
