import styles from './AuthGateLayout.module.css';

// Pantalla de acceso: tarjeta centrada con marca, texto, acción y nota al pie.
export function AuthGateLayout({ title, lead, action, footer }) {
  return (
    <div className={styles.gate}>
      <div className={styles.context} aria-hidden="true">
        <strong>Compra simple,<br />pedidos claros.</strong>
        <span>Catálogo, pedidos y seguimiento en un solo lugar.</span>
      </div>
      <div className={styles.card}>
        <h1>{title}</h1>
        <p className={styles.lead}>{lead}</p>
        {action}
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  );
}
