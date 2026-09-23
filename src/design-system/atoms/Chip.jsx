import { Dot } from './Dot';
import styles from './Chip.module.css';

// Botón tipo "pastilla" con estado presionado, punto de color y contador opcionales.
export function Chip({ pressed, dot, count, children, ...props }) {
  return (
    <button type="button" className={styles.chip} aria-pressed={pressed} {...props}>
      {dot && <Dot color={dot} />}
      {children}
      {count !== undefined && <b>{count}</b>}
    </button>
  );
}
