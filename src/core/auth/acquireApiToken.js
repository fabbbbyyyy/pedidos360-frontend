import { InteractionRequiredAuthError, BrowserAuthError } from '@azure/msal-browser';
import { apiRequest } from './authConfig';

const SILENT_TIMEOUTS = ['timed_out', 'monitor_window_timeout'];

function needsInteraction(error) {
  return (
    error instanceof InteractionRequiredAuthError ||
    // El iframe silencioso no completa (p. ej. Chrome bloquea cookies de terceros).
    (error instanceof BrowserAuthError && SILENT_TIMEOUTS.includes(error.errorCode))
  );
}

// Access token para llamar al backend. Si falta consentimiento/MFA cae a redirect.
export async function acquireApiToken(instance, account) {
  try {
    const result = await instance.acquireTokenSilent({ ...apiRequest, account });
    return result.accessToken;
  } catch (error) {
    if (needsInteraction(error)) {
      await instance.acquireTokenRedirect({ ...apiRequest, account }); // navega y vuelve
    }
    throw error;
  }
}
