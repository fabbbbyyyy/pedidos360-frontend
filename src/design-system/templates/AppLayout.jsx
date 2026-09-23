import styles from './AppLayout.module.css';

// Layout base de la app autenticada: menú lateral + área principal.
export function AppLayout({ sidebar, children }) {
  return (
    <div className={styles.app}>
      {sidebar}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
