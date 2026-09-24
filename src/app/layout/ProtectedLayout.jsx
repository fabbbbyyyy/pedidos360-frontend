import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useSession } from '@/core/auth/SessionProvider';
import { AppHeader, CartDrawer } from '@/design-system/organisms';
import { AppLayout, CenteredMessage } from '@/design-system/templates';
import { modules } from '../modules';

// Layout de la zona autenticada: menú lateral (filtrado por rol) + página activa.
export default function ProtectedLayout() {
  const { account, user, hasRole, logout } = useSession();

  const navItems = modules.filter((m) => !m.roles || hasRole(...m.roles));

  return (
    <AppLayout sidebar={<AppHeader items={navItems} user={user} onLogout={logout} />}>
      <Suspense fallback={<CenteredMessage title="Cargando…" />}><Outlet /></Suspense>
      <CartDrawer />
    </AppLayout>
  );
}
