import { Button, IconClose } from '../atoms';
import { EmptyState } from '../molecules';
import styles from './DetailPanel.module.css';

// Panel lateral. Sirve para detalle, formularios de alta y edición.
export function DetailPanel({ title, subtitle, onClose, headContent, footer, children }) {
  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <div className={styles.row}>
          <div className={styles.titles}>
            <h2>{title}</h2>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          {onClose && (
            <Button variant="ghost" aria-label="Cerrar panel" onClick={onClose}>
              <IconClose />
            </Button>
          )}
        </div>
        {headContent}
      </div>
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.foot}>{footer}</div>}
    </aside>
  );
}

// Estado vacío del panel: no hay nada seleccionado.
export function PanelPlaceholder({ title, subtitle, emptyTitle, children }) {
  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <h2>{title}</h2>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
      <EmptyState title={emptyTitle}>{children}</EmptyState>
    </aside>
  );
}

export const PanelDivider = () => <div className={styles.hr} />;
export const PanelSectionTitle = ({ children }) => <div className={styles.sectionTitle}>{children}</div>;
