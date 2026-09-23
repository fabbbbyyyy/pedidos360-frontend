import { env } from '@/core/config/env';

export const msalConfig = {
  auth: {
    clientId: env.azureClientId,
    authority: `https://login.microsoftonline.com/${env.azureTenantId}`,
    redirectUri: env.azureRedirectUri,
    postLogoutRedirectUri: env.azureRedirectUri,
  },
  cache: { cacheLocation: 'localStorage' },
};

// Login inicial: basta identidad.
export const loginRequest = { scopes: ['openid', 'profile'] };

// Scopes de NUESTRA API (no User.Read de Graph). El access_token resultante trae
// audience = identidad del backend, que es el que valida el JWT Authorizer del Gateway.
export const API_SCOPE_NAMES = ['orders.read', 'orders.write', 'catalog.read', 'catalog.write'];

export const apiRequest = {
  scopes: API_SCOPE_NAMES.map((name) => `${env.apiScopeBase}/${name}`),
};
