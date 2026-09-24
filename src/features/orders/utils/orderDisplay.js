import { STATUS_LABEL } from '../constants/orderStatus';

export function getOrderCustomerName(order, user) {
  if (order.customerName) return order.customerName;
  if (order.customer?.name) return order.customer.name;
  if (order.customerId === user?.id) return user.name;
  return 'Cliente';
}

const label = (status) => STATUS_LABEL[status] ?? status ?? 'estado desconocido';

export function describeHistoryEntry(entry) {
  if (!entry.fromStatus) return `Pedido creado como ${label(entry.toStatus)}`;
  return `Cambió de ${label(entry.fromStatus)} a ${label(entry.toStatus)}`;
}