import { ROLES } from '@/core/auth/roles';
import { ORDER_STATUS, TRANSITIONS } from '../constants/orderStatus';

// Qué acciones ofrece la UI para un pedido según su estado y el rol del usuario.
export function getOrderActions(status, { can, hasRole }) {
  const targets = TRANSITIONS[status] ?? [];
  const none = { next: null, canCancel: false };
  const canCancel = can('orders', 'delete') && targets.includes(ORDER_STATUS.CANCELLED);

  if (!can('orders', 'updateStatus')) return { ...none, canCancel };

  const privileged = hasRole(ROLES.ADMIN, ROLES.OPERADOR);
  return {
    next: privileged ? targets.find((t) => t !== ORDER_STATUS.CANCELLED) ?? null : null,
    canCancel,
  };
}
