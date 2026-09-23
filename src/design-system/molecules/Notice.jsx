import { cx } from '@/shared/utils/cx';
import styles from './Notice.module.css';

// variant: 'info' | 'warning' | 'error'
export function Notice({ variant = 'info', className, children }) {
  return (
    <div className={cx(styles.note, variant !== 'info' && styles[variant], className)} role={variant === 'error' ? 'alert' : undefined}>
      {children}
    </div>
  );
}
