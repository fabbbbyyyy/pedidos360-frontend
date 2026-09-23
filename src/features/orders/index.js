import { lazy } from 'react';
import { PERMISSIONS } from '@/core/auth/permissions';
import { IconOrders } from '@/design-system/atoms';

// Manifiesto del módulo: lo único que la app necesita saber para registrarlo.
export default {
  id: 'orders',
  path: '/orders',
  label: 'Pedidos',
  icon: IconOrders,
  roles: PERMISSIONS.orders.read,
  Page: lazy(() => import('./pages/OrdersPage')),
};
