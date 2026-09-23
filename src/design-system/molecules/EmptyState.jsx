import styles from './EmptyState.module.css';

export function EmptyState({ title, children }) {
  return (
    <div className={styles.empty}>
      <h3>{title}</h3>
      {children && <div className={styles.body}>{children}</div>}
    </div>
  );
}
