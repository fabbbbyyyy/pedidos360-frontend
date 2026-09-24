import { Dot } from '@/design-system/atoms';
import { cx } from '@/shared/utils/cx';
import { ORDER_STATUS, STATUS_LABEL, STATUS_TONE } from '../constants/orderStatus';
import styles from './OrderStatusBadge.module.css';

// Punto de color + etiqueta de un estado de pedido.
export default function OrderStatusBadge({ status }) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.PENDING;
  return (
    <span className={cx(styles.state, styles[`tone-${status.toLowerCase()}`])}>
      <Dot color={tone.dot} />
      <span className={cx(status === ORDER_STATUS.CANCELLED && styles.struck)}>
        {STATUS_LABEL[status] ?? status}
      </span>
    </span>
  );
}
