import { Button } from '@/design-system/atoms';
import { FactsList, Notice } from '@/design-system/molecules';
import { DetailPanel, PanelDivider, PanelSectionTitle } from '@/design-system/organisms';
import { formatCLP, formatFullDate } from '@/shared/utils/format';
import { ADVANCE_LABEL } from '../constants/orderStatus';
import OrderStatusBadge from './OrderStatusBadge';
import OrderStatusStepper from './OrderStatusStepper';
import styles from './OrderDetail.module.css';

// actions: { next, canCancel, canDelete } (ver utils/orderActions.js)
export default function OrderDetail({ order, productsById, actions, busy, onClose, onAdvance, onCancel, onDelete }) {
  const hasFooter = actions.next || actions.canCancel || actions.canDelete;

  return (
    <DetailPanel
      title={order.customerId}
      subtitle={order.id}
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
            {actions.canDelete && (
              <Button variant="danger" disabled={busy} onClick={() => onDelete(order)}>Eliminar</Button>
            )}
          </>
        )
      }
    >
      <FactsList
        items={[
          { label: 'Cliente', value: order.customerId, mono: true },
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
            <span className={styles.n}>
              {productsById[item.productId]?.name ?? 'Producto no disponible'}
              <small>{item.productId}</small>
            </span>
            <span className={styles.p}>{formatCLP(item.unitPrice)}</span>
          </div>
        ))}
      </div>

      <div className={styles.sum}>
        <span>Total</span>
        <b>{formatCLP(order.total)}</b>
      </div>

      <Notice className={styles.note}>
        El stock se descontó automáticamente al crear el pedido. Si lo cancelas o lo eliminas, el backend
        todavía no lo repone.
      </Notice>
    </DetailPanel>
  );
}
