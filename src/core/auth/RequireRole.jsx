import { Outlet } from 'react-router-dom';
import { CenteredMessage } from '@/design-system/templates';
import { useSession } from './SessionProvider';

// Guard de AUTORIZACIÓN: con sesión ya confirmada, ¿tiene alguno de los roles exigidos?
// Si `roles` viene vacío o undefined, basta con estar autenticado.
export function RequireRole({ roles }) {
  const { hasRole } = useSession();

  if (roles?.length && !hasRole(...roles)) {
    return (
      <CenteredMessage title="Acceso restringido">
        <p>Esta sección requiere uno de estos roles: {roles.join(', ')}.</p>
      </CenteredMessage>
    );
  }
  return <Outlet />;
}
