import { Button, IconClose } from '@/design-system/atoms';
import { FactsList } from '@/design-system/molecules';
import { formatCLP, formatFullDate } from '@/shared/utils/format';
import { getOrderCustomerName } from '../utils/orderDisplay';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { ADVANCE_LABEL, STATUS_LABEL } from '../constants/orderStatus';
import OrderStatusBadge from './OrderStatusBadge';
import OrderStatusStepper from './OrderStatusStepper';
import styles from './OrderModal.module.css';

export default function OrderModal({ order, productsById, user, actions, busy, error, onClose, onAdvance, onCancel }) {
  const dialogRef = useDialogA11y({ onClose, disabled: busy });
  const customerName = getOrderCustomerName(order, user);
  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} tabIndex="-1" className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
        <header className={styles.header}>
          <div><span className={styles.eyebrow}>Detalle del pedido</span><h2 id="order-modal-title">Cliente: {customerName}</h2><span className={styles.orderNumber}>Número de orden: {order.id}</span></div>
          <Button variant="ghost" aria-label="Cerrar detalle" onClick={onClose}><IconClose /></Button>
        </header>
        <div className={styles.status}><OrderStatusBadge status={order.status} /><OrderStatusStepper status={order.status} /></div>
        <div className={styles.body}>
          {error && <div className={styles.error} role="alert">{error}</div>}
          <FactsList items={[{ label: 'Cliente', value: customerName }, { label: 'Creado por', value: order.createdBy }, { label: 'Creado', value: formatFullDate(order.createdAt) }, { label: 'Actualizado', value: formatFullDate(order.updatedAt) }]} />
          {order.history?.length > 0 && (
            <section className={styles.history} aria-labelledby="order-history-title">
              <h3 id="order-history-title">Historial del pedido</h3>
              <ol>
                {order.history.map((entry, index) => (
                  <li key={`${entry.changedAt ?? entry.createdAt ?? index}-${entry.status}`}>
                    <strong>{STATUS_LABEL[entry.status] ?? entry.status}</strong>
                    <span>{formatFullDate(entry.changedAt ?? entry.createdAt)}</span>
                    {entry.changedBy && <small>por {typeof entry.changedBy === 'string' ? entry.changedBy : entry.changedBy.name ?? entry.changedBy.id}</small>}
                  </li>
                ))}
              </ol>
            </section>
          )}
          <section className={styles.itemsSection}>
            <h3>Productos del pedido</h3>
            <div className={styles.items}>
              {order.items?.map((item) => (
                <div className={styles.item} key={item.productId}>
                  <span className={styles.q}>{item.quantity} x</span>
                  <span className={styles.name}>{productsById[item.productId]?.name ?? 'Producto no disponible'}<small>{item.productId}</small></span>
                  <strong>{formatCLP(item.unitPrice * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className={styles.total}><span>Total del pedido</span><strong>{formatCLP(order.total)}</strong></div>
          </section>
        </div>
        {(actions.next || actions.canCancel) && <footer className={styles.footer}>
          {actions.next && <Button variant="primary" block disabled={busy} onClick={() => onAdvance(order, actions.next)}>{ADVANCE_LABEL[actions.next]}</Button>}
          {actions.canCancel && <Button variant="danger" disabled={busy} onClick={() => onCancel(order)}>Cancelar</Button>}
        </footer>}
      </section>
    </div>
  );
}
