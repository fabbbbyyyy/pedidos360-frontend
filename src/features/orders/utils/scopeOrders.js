import { ROLES } from '@/core/auth/roles';

// GET /api/orders devuelve TODOS los pedidos. Para un cliente se muestran solo los suyos.
// OJO: esto es cosmético. El filtrado real por usuario debe hacerse en el backend.
export function scopeOrdersToUser(orders, { user, hasRole }) {
  if (hasRole(ROLES.ADMIN, ROLES.OPERADOR)) return orders;
  const email = user.email?.toLowerCase();
  return orders.filter(
    (order) => order.customerId === user.id || (email && order.createdBy?.toLowerCase() === email),
  );
}

export const sortByNewest = (orders) =>
  [...orders].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
