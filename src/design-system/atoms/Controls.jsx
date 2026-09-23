import { cx } from '@/shared/utils/cx';
import styles from './Controls.module.css';

export function Input({ invalid, className, ...props }) {
  return <input className={cx(styles.control, invalid && styles.invalid, className)} {...props} />;
}

export function Select({ invalid, className, children, ...props }) {
  return (
    <select className={cx(styles.control, invalid && styles.invalid, className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ invalid, className, ...props }) {
  return <textarea className={cx(styles.control, invalid && styles.invalid, className)} {...props} />;
}
