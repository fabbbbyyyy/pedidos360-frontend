import { ROLES } from '@/core/auth/roles';
import { ORDER_STATUS, TRANSITIONS } from '../constants/orderStatus';

// Qué acciones ofrece la UI para un pedido según su estado y el rol del usuario.
//  - admin / operador: avanzan el pedido y pueden cancelarlo.
//  - cliente: solo puede cancelar.
// El backend permite updateStatus a los 3 roles; esta restricción es de UX.
export function getOrderActions(status, { can, hasRole }) {
  const targets = TRANSITIONS[status] ?? [];
  const none = { next: null, canCancel: false, canDelete: false };
  const canDelete = can('orders', 'delete');

  if (!can('orders', 'updateStatus')) return { ...none, canDelete };

  const privileged = hasRole(ROLES.ADMIN, ROLES.OPERADOR);
  return {
    next: privileged ? targets.find((t) => t !== ORDER_STATUS.CANCELLED) ?? null : null,
    canCancel: targets.includes(ORDER_STATUS.CANCELLED),
    canDelete,
  };
}
