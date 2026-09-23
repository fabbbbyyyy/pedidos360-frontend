import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { missingEnv } from '@/core/config/env';
import { CenteredMessage } from '@/design-system/templates';
import '@/app/styles/tokens.css';
import '@/app/styles/base.css';

async function bootstrap() {
  const root = createRoot(document.getElementById('root'));

  if (missingEnv.length > 0) {
    root.render(
      <CenteredMessage title="Falta configuración">
        <p>Define estas variables en tu archivo .env (ver .env.example): {missingEnv.join(', ')}</p>
      </CenteredMessage>,
    );
    return;
  }

  // Import dinámico: msalInstance solo se crea si la configuración está completa.
  const [{ initMsal }, { default: App }] = await Promise.all([
    import('@/core/auth/msalInstance'),
    import('./App'),
  ]);

  // MSAL v3+ exige initialize() ANTES de renderizar.
  await initMsal();

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
