import styles from './Kbd.module.css';

export function Kbd({ children }) {
  return <span className={styles.kbd}>{children}</span>;
}
