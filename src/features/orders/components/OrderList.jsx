import { EmptyState } from '@/design-system/molecules';
import { formatCLP, formatRelativeDate } from '@/shared/utils/format';
import OrderStatusBadge from './OrderStatusBadge';
import styles from './OrderList.module.css';

export default function OrderList({ orders, selectedId, onSelect }) {
  if (orders.length === 0) return <div className={styles.empty}><EmptyState title="No hay pedidos que coincidan"><p>Prueba con otro término de búsqueda o cambia el filtro de estado.</p></EmptyState></div>;

  return <div className={styles.list}>
    {orders.map((order) => (
      <button type="button" className={styles.row} key={order.id} aria-pressed={order.id === selectedId} onClick={() => onSelect(order.id)}>
        <div className={styles.order}><span className={styles.id}>{order.id}</span><span className={styles.customer}>{order.customerId}</span></div>
        <div><span className={styles.label}>Productos</span><span className={styles.value}>{order.items?.length ?? 0}</span></div>
        <div><span className={styles.label}>Total</span><span className={styles.total}>{formatCLP(order.total)}</span></div>
        <div><span className={styles.label}>Estado</span><OrderStatusBadge status={order.status} /></div>
        <div className={styles.date}>{formatRelativeDate(order.createdAt)}</div>
        <span className={styles.arrow} aria-hidden="true">›</span>
      </button>
    ))}
  </div>;
}
