import styles from './LogoMark.module.css';

export function LogoMark({ size = 22 }) {
  return <div className={styles.mark} style={{ width: size, height: size }} aria-hidden="true" />;
}
