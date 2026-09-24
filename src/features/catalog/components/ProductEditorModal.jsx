import { Button, IconClose } from '@/design-system/atoms';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import ProductForm from './ProductForm';
import styles from './ProductEditorModal.module.css';

export default function ProductEditorModal({ product, categories, submitting, error, onSubmit, onClose }) {
  const editing = Boolean(product);
  const dialogRef = useDialogA11y({ onClose, disabled: submitting });

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !submitting && onClose()}>
      <section ref={dialogRef} tabIndex="-1" className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="product-editor-title">
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>{editing ? 'Administrar catálogo' : 'Nuevo producto'}</span>
            <h2 id="product-editor-title">{editing ? 'Editar producto' : 'Crear producto'}</h2>
            <p>{editing ? 'Actualiza la información del producto.' : 'Completa los datos para incorporarlo al catálogo.'}</p>
          </div>
          <Button variant="ghost" aria-label="Cerrar formulario" onClick={onClose} disabled={submitting}><IconClose /></Button>
        </header>
        <div className={styles.body}>
          <ProductForm product={product} categories={categories} submitting={submitting} error={error} onSubmit={onSubmit} onCancel={onClose} />
        </div>
        <footer className={styles.footer}>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button variant="primary" type="submit" form="product-form" disabled={submitting}>
            {submitting ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </footer>
      </section>
    </div>
  );
}