import { EmptyState } from '../molecules';
import styles from './CenteredMessage.module.css';

// Mensaje centrado a pantalla completa o dentro de un área: cargando, error, sin acceso.
export function CenteredMessage({ title, children }) {
  return (
    <div className={styles.wrap}>
      <EmptyState title={title}>{children}</EmptyState>
    </div>
  );
}
