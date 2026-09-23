import { LogoMark } from '../atoms';
import styles from './AuthGateLayout.module.css';

// Pantalla de acceso: tarjeta centrada con marca, texto, acción y nota al pie.
export function AuthGateLayout({ title, lead, action, footer }) {
  return (
    <div className={styles.gate}>
      <div className={styles.card}>
        <div className={styles.logo}><LogoMark size={28} /></div>
        <h2>{title}</h2>
        <p className={styles.lead}>{lead}</p>
        {action}
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  );
}
