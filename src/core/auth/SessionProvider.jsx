import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { acquireApiToken } from './acquireApiToken';
import { decodeJwt } from './jwt';
import { PERMISSIONS } from './permissions';
import { env } from '@/core/config/env';
import { Button } from '@/design-system/atoms';
import { CenteredMessage } from '@/design-system/templates';

const SessionContext = createContext(null);

const normalizeRoles = (roles) =>
  (Array.isArray(roles) ? roles : []).map((role) => String(role).toLowerCase());

function buildUser(account) {
  const name = account.name || account.username || 'Usuario';
  return {
    id: account.localAccountId, // oid del usuario en Entra ID
    name,
    email: account.username,
    initials: name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
  };
}

// Lee los App Roles del ACCESS TOKEN de la API (audience = backend), no del ID token:
// es exactamente el claim que después valida el backend. Es UX, no seguridad.
export function SessionProvider({ children }) {
  const { instance, accounts } = useMsal();
  const account = accounts[0] ?? instance.getActiveAccount();
  const accountId = account?.homeAccountId;
  const [state, setState] = useState({ status: 'loading', roles: [] });

  useEffect(() => {
    if (!accountId) return undefined;
    let cancelled = false;
    acquireApiToken(instance, account)
      .then((token) => {
        if (!cancelled) setState({ status: 'ready', roles: normalizeRoles(decodeJwt(token)?.roles) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', roles: [] });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, accountId]);

  const value = useMemo(() => {
    if (!account) return null;
    const hasRole = (...wanted) => wanted.some((role) => state.roles.includes(role));
    return {
      account,
      user: buildUser(account),
      roles: state.roles,
      hasRole,
      can: (resource, action) => hasRole(...(PERMISSIONS[resource]?.[action] ?? [])),
    };
  }, [account, state.roles]);

  if (!account || state.status === 'loading') {
    return <CenteredMessage title="Preparando tu acceso…" />;
  }

  if (state.status === 'error') {
    return (
      <CenteredMessage title="No pudimos verificar tu acceso">
        <p>Tu sesión no pudo validarse. Cierra sesión e inténtalo nuevamente o contacta a soporte.</p>
        <Button
          onClick={() => instance.logoutRedirect({ account, postLogoutRedirectUri: env.azureRedirectUri })}
        >
          Cerrar sesión
        </Button>
      </CenteredMessage>
    );
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession debe usarse dentro de <SessionProvider>');
  return context;
}
