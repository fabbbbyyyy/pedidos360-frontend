import { useSession } from '@/core/auth/SessionProvider';
import { ROLES } from '@/core/auth/roles';
import { EmptyState, Notice } from '@/design-system/molecules';
import { Topbar } from '@/design-system/organisms';
import { PageLayout } from '@/design-system/templates';
import { dashboardWidgets } from '../widgets';
import styles from './DashboardPage.module.css';

const ROLE_HINTS = {
  [ROLES.ADMIN]: 'Gestiona el catálogo y supervisa todos los pedidos.',
  [ROLES.OPERADOR]: 'Da seguimiento a los pedidos: confirma, envía y entrega.',
  [ROLES.CLIENTE]: 'Crea pedidos y sigue el estado de los tuyos.',
  [ROLES.AUDITOR]: 'Tu rol es de consulta. Por ahora no tiene módulos habilitados.',
};

const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.OPERADOR]: 'Operador',
  [ROLES.CLIENTE]: 'Cliente',
  [ROLES.AUDITOR]: 'Auditor',
};

export default function DashboardPage() {
  const { user, roles, hasRole } = useSession();
  const firstName = user.name.split(/\s+/)[0];
  const widgets = dashboardWidgets.filter((w) => !w.roles || hasRole(...w.roles));

  return (
    <PageLayout header={<Topbar title={`Hola, ${firstName}`} subtitle={roles.length ? `Perfil: ${roles.map((role) => ROLE_LABELS[role] ?? role).join(', ')}` : 'Acceso pendiente'} />}>
      <div className={styles.content}>
        {roles.length === 0 ? (
          <Notice variant="warning">
            Tu cuenta todavía no tiene acceso configurado. Solicita ayuda a un administrador para consultar pedidos y catálogo.
          </Notice>
        ) : (
          <p className={styles.hint}>{roles.map((r) => ROLE_HINTS[r]).filter(Boolean).join(' ')}</p>
        )}

        {widgets.length > 0 ? (
          <div className={styles.widgets}>
            {widgets.map(({ id, Component }) => <Component key={id} />)}
          </div>
        ) : (
          <EmptyState title="Aún no hay indicadores">
            <p>Los resúmenes de actividad de tu rol aparecerán aquí cuando se agreguen.</p>
          </EmptyState>
        )}
      </div>
    </PageLayout>
  );
}
