import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { env } from '@/core/config/env';
import { useSession } from '@/core/auth/SessionProvider';
import { Sidebar } from '@/design-system/organisms';
import { AppLayout, CenteredMessage } from '@/design-system/templates';
import { modules } from '../modules';

// Layout de la zona autenticada: menú lateral (filtrado por rol) + página activa.
export default function ProtectedLayout() {
  const { instance } = useMsal();
  const { account, user, hasRole } = useSession();

  const navItems = modules.filter((m) => !m.roles || hasRole(...m.roles));
  const logout = () => instance.logoutRedirect({ account, postLogoutRedirectUri: env.azureRedirectUri });

  return (
    <AppLayout sidebar={<Sidebar items={navItems} user={user} onLogout={logout} />}>
      <Suspense fallback={<CenteredMessage title="Cargando…" />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}
