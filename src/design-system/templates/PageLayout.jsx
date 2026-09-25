import styles from './PageLayout.module.css';

// Estructura estándar de una pantalla:
// header (Topbar) · filters · notice · [ contenido con scroll | panel lateral ]
export function PageLayout({ header, filters, notice, panel, children }) {
  return (
    <section className={styles.view}>
      {header}
      {filters}
      {notice && <div className={styles.notice}>{notice}</div>}
      <div className={styles.body}>
        <div className={styles.col}>
          <div className={styles.scroll}>{children}</div>
        </div>
          {panel && <aside className={styles.panel}>{panel}</aside>}
      </div>
    </section>
  );
}
