import { Button, IconClose } from '../atoms';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', danger = false, busy = false, onConfirm, onClose }) {
  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <header className={styles.header}>
          <div className={styles.icon}>!</div>
          <Button variant="ghost" aria-label="Cerrar" onClick={onClose} disabled={busy}><IconClose /></Button>
        </header>
        <div className={styles.content}>
          <h2 id="confirm-title">{title}</h2>
          <p id="confirm-message">{message}</p>
        </div>
        <footer className={styles.footer}>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Volver</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>
            {busy ? 'Procesando…' : confirmLabel}
          </Button>
        </footer>
      </section>
    </div>
  );
}
