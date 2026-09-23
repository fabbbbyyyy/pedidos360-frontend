import { cx } from '@/shared/utils/cx';
import styles from './Button.module.css';

// variant: 'default' | 'primary' | 'ghost' | 'danger'
export function Button({ variant = 'default', block = false, type = 'button', className, ...props }) {
  return (
    <button
      type={type}
      className={cx(styles.btn, variant !== 'default' && styles[variant], block && styles.block, className)}
      {...props}
    />
  );
}
