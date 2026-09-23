import { cx } from '@/shared/utils/cx';
import styles from './FactsList.module.css';

// items: [{ label, value, mono?, color? }]
export function FactsList({ items }) {
  return (
    <dl className={styles.facts}>
      {items.map((item) => (
        <FactRow key={item.label} {...item} />
      ))}
    </dl>
  );
}

function FactRow({ label, value, mono, color }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={cx(mono && 'num')} style={color ? { color } : undefined}>{value}</dd>
    </>
  );
}
