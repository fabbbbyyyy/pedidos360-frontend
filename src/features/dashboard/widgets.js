// Punto de extensión del dashboard. Cada widget se registra acá y se muestra
// solo a los roles indicados. Ejemplo:
//
//   { id: 'orders-kpis', roles: [ROLES.ADMIN], Component: OrdersKpis }
//
// Sin `roles`, lo ven todos los usuarios autenticados.
export const dashboardWidgets = [];
