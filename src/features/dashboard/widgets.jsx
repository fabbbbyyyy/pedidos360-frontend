import { Link } from 'react-router-dom';
import { useProducts } from '@/features/catalog/hooks/useCatalog';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { ORDER_STATUS } from '@/features/orders/constants/orderStatus';
import { ROLES } from '@/core/auth/roles';
import styles from './pages/DashboardPage.module.css';

function Metric({ label, value, hint, to }) {
  const content = (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
  return to ? <Link className={styles.metricLink} to={to}>{content}</Link> : content;
}

function OrdersOverview() {
  const ordersQuery = useOrders();
  const orders = ordersQuery.data ?? [];
  const active = orders.filter((order) => ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(order.status));
  const pending = orders.filter((order) => order.status === ORDER_STATUS.PENDING).length;

  if (ordersQuery.isLoading) return <div className={styles.widgetLoading}>Cargando pedidos…</div>;
  if (ordersQuery.isError) return <div className={styles.widgetError}>No pudimos cargar los indicadores de pedidos.</div>;

  return (
    <section className={styles.widget} aria-labelledby="orders-overview-title">
      <div className={styles.widgetHeader}><div><span className={styles.eyebrow}>Operación</span><h2 id="orders-overview-title">Pedidos</h2></div><Link to="/orders">Ver todos</Link></div>
      <div className={styles.metrics}>
        <Metric label="Activos" value={active.length} hint="En proceso" />
        <Metric label="Pendientes" value={pending} hint="Requieren confirmación" to="/orders" />
        <Metric label="Historial" value={orders.length} hint="Pedidos disponibles" to="/orders" />
      </div>
    </section>
  );
}

function CatalogOverview() {
  const productsQuery = useProducts();
  const products = productsQuery.data ?? [];
  const lowStock = products.filter((product) => product.stock <= 5).length;

  if (productsQuery.isLoading) return <div className={styles.widgetLoading}>Cargando catálogo…</div>;
  if (productsQuery.isError) return <div className={styles.widgetError}>No pudimos cargar los indicadores del catálogo.</div>;

  return (
    <section className={styles.widget} aria-labelledby="catalog-overview-title">
      <div className={styles.widgetHeader}><div><span className={styles.eyebrow}>Inventario</span><h2 id="catalog-overview-title">Catálogo</h2></div><Link to="/catalog">Abrir catálogo</Link></div>
      <div className={styles.metrics}>
        <Metric label="Productos" value={products.length} hint="En catálogo" to="/catalog" />
        <Metric label="Stock bajo" value={lowStock} hint="5 unidades o menos" to="/catalog" />
      </div>
    </section>
  );
}

export const dashboardWidgets = [
  { id: 'orders-overview', roles: [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE], Component: OrdersOverview },
  { id: 'catalog-overview', roles: [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE], Component: CatalogOverview },
];