import styles from './Dot.module.css';

export function Dot({ color = 'var(--text-3)' }) {
  return <i className={styles.dot} style={{ background: color }} />;
}
