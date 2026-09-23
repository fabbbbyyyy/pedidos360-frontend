import { lazy } from 'react';
import { PERMISSIONS } from '@/core/auth/permissions';
import { IconCatalog } from '@/design-system/atoms';

// Manifiesto del módulo: lo único que la app necesita saber para registrarlo.
export default {
  id: 'catalog',
  path: '/catalog',
  label: 'Catálogo',
  icon: IconCatalog,
  roles: PERMISSIONS.catalog.read,
  Page: lazy(() => import('./pages/CatalogPage')),
};
