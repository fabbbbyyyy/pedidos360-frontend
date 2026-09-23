// Única puerta de entrada a las variables de entorno.
const raw = {
  VITE_AZURE_CLIENT_ID: import.meta.env.VITE_AZURE_CLIENT_ID,
  VITE_AZURE_TENANT_ID: import.meta.env.VITE_AZURE_TENANT_ID,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_SCOPE_BASE: import.meta.env.VITE_API_SCOPE_BASE,
};

// main.jsx muestra una pantalla de configuración si falta alguna.
export const missingEnv = Object.entries(raw)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const trimSlash = (value = '') => value.replace(/\/+$/, '');

export const env = {
  azureClientId: raw.VITE_AZURE_CLIENT_ID,
  azureTenantId: raw.VITE_AZURE_TENANT_ID,
  azureRedirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
  apiBaseUrl: trimSlash(raw.VITE_API_BASE_URL),
  apiScopeBase: trimSlash(raw.VITE_API_SCOPE_BASE),
};
