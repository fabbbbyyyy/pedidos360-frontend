import { cx } from '@/shared/utils/cx';
import { LOW_STOCK_THRESHOLD, getStockLevel } from '../constants/stock';
import styles from './StockMeter.module.css';

// Barra + número de stock. Color según nivel: normal, bajo (ámbar) o agotado (rojo).
export default function StockMeter({ stock }) {
  const level = getStockLevel(stock);
  const pct = Math.min(100, Math.round((stock / (LOW_STOCK_THRESHOLD * 4)) * 100));
  return (
    <div className={cx(styles.stock, level !== 'ok' && styles[level])}>
      <span className={styles.bar}><span className={styles.fill} style={{ width: `${pct}%` }} /></span>
      <span className={styles.n}>{stock}</span>
    </div>
  );
}
