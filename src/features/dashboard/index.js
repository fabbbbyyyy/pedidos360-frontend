import { lazy } from 'react';
import { IconHome } from '@/design-system/atoms';

export default {
  id: 'dashboard',
  path: '/dashboard',
  label: 'Inicio',
  icon: IconHome,
  roles: null, // cualquier usuario autenticado
  Page: lazy(() => import('./pages/DashboardPage')),
};
