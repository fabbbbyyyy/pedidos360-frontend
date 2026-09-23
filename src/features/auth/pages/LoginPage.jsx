import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from '@/core/auth/authConfig';
import { Button } from '@/design-system/atoms';
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
      .catch((e) => setError(e.message));
  };

  return (
    <AuthGateLayout
      title="Pedidos360"
      lead="Entra con tu cuenta corporativa. El panel usa el mismo inicio de sesión que el correo, así que no hay contraseña aparte."
      action={
        <>
          <Button variant="primary" block onClick={handleLogin} disabled={inProgress !== InteractionStatus.None}>
            Entrar con la cuenta de la empresa
          </Button>
          {error && <div style={{ marginTop: 12 }}><Notice variant="error">{error}</Notice></div>}
        </>
      }
      footer={
        <>
          ¿No puedes entrar? Escribe a soporte interno. Tu cuenta necesita los permisos <code>orders.read</code> y{' '}
          <code>catalog.read</code> para ver pedidos y catálogo.
        </>
      }
    />
  );
}
