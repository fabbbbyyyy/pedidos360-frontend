export function getOrderCustomerName(order, user) {
  if (order.customerName) return order.customerName;
  if (order.customer?.name) return order.customer.name;
  if (order.customerId === user?.id) return user.name;
  return 'Cliente';
}
