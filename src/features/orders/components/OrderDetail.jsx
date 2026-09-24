import { Button } from '@/design-system/atoms';
import { FactsList } from '@/design-system/molecules';
import { DetailPanel, PanelDivider, PanelSectionTitle } from '@/design-system/organisms';
import { formatCLP, formatFullDate } from '@/shared/utils/format';
import { getOrderCustomerName } from '../utils/orderDisplay';
import { ADVANCE_LABEL } from '../constants/orderStatus';
import OrderStatusBadge from './OrderStatusBadge';
import OrderStatusStepper from './OrderStatusStepper';
import styles from './OrderDetail.module.css';

// actions: { next, canCancel } (ver utils/orderActions.js)
export default function OrderDetail({ order, productsById, user, actions, busy, onClose, onAdvance, onCancel }) {
  const hasFooter = actions.next || actions.canCancel;
  const customerName = getOrderCustomerName(order, user);

  return (
    <DetailPanel
      title={`Cliente: ${customerName}`}
      subtitle={`Número de orden: ${order.id}`}
      onClose={onClose}
      headContent={
        <>
          <div className={styles.badge}><OrderStatusBadge status={order.status} /></div>
          <OrderStatusStepper status={order.status} />
        </>
      }
      footer={
        hasFooter && (
          <>
            {actions.next && (
              <Button variant="primary" block disabled={busy} onClick={() => onAdvance(order, actions.next)}>
                {ADVANCE_LABEL[actions.next]}
              </Button>
            )}
            {actions.canCancel && (
              <Button variant="danger" disabled={busy} onClick={() => onCancel(order)}>Cancelar</Button>
            )}
          </>
        )
      }
    >
      <FactsList
        items={[
          { label: 'Cliente', value: customerName },
          { label: 'Creado por', value: order.createdBy },
          { label: 'Creado', value: formatFullDate(order.createdAt) },
          { label: 'Última actualización', value: formatFullDate(order.updatedAt) },
        ]}
      />

      <PanelDivider />

      <PanelSectionTitle>Ítems del pedido</PanelSectionTitle>
      <div className={styles.items}>
        {order.items?.map((item) => (
          <div className={styles.item} key={item.productId}>
            <span className={styles.q}>{item.quantity} ×</span>
            {productsById[item.productId] ? (
              <span className={styles.n}>{productsById[item.productId].name}</span>
            ) : (
              <span className={styles.n}>
                Producto no disponible
                <small>ID: {item.productId}</small>
              </span>
            )}
            <span className={styles.p}>{formatCLP(item.unitPrice)}</span>
          </div>
        ))}
      </div>

      <div className={styles.sum}>
        <span>Total</span>
        <b>{formatCLP(order.total)}</b>
      </div>

    </DetailPanel>
  );
}