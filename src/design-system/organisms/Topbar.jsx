import styles from './Topbar.module.css';

// Cabecera de página: título + subtítulo a la izquierda, acciones (children) a la derecha.
export function Topbar({ title, subtitle, children }) {
  return (
    <header className={styles.topbar}>
      <div>
        <h1 className={styles.h1}>{title}</h1>
        {subtitle && <div className={styles.sub}>{subtitle}</div>}
      </div>
      <div className={styles.spacer} />
      {children}
    </header>
  );
}
