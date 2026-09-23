import { cx } from '@/shared/utils/cx';
import { ORDER_STATUS, STATUS_LABEL, STATUS_SEQUENCE } from '../constants/orderStatus';
import styles from './OrderStatusStepper.module.css';

// CANCELLED no es un paso más: un pedido cancelado muestra el stepper apagado
// y su estado real se ve en el OrderStatusBadge.
export default function OrderStatusStepper({ status }) {
  const current = STATUS_SEQUENCE.indexOf(status);
  const cancelled = status === ORDER_STATUS.CANCELLED;

  return (
    <div className={styles.stepper}>
      {STATUS_SEQUENCE.map((step, index) => (
        <div
          key={step}
          className={cx(styles.step, !cancelled && index < current && styles.done, !cancelled && index === current && styles.now)}
        >
          <div className={styles.line} />
          <div className={styles.lbl}>{STATUS_LABEL[step]}</div>
        </div>
      ))}
    </div>
  );
}
