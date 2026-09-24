import { useState } from 'react';
import { Button, IconCart, IconClose, IconMinus, IconPlus } from '@/design-system/atoms';
import { FactsList } from '@/design-system/molecules';
import { formatCLP } from '@/shared/utils/format';
import { getStockLevel } from '../constants/stock';
import styles from './ProductModal.module.css';

const STOCK_LABEL = { out: 'Sin stock', low: 'Últimas unidades', ok: 'Disponible' };

export default function ProductModal({ product, canEdit, canDelete, onClose, onAdd, onEdit, onDelete }) {
  const [quantity, setQuantity] = useState(1);
  const level = getStockLevel(product.stock);
  const unavailable = level === 'out';

  function addToCart() {
    onAdd(product, quantity);
    onClose();
  }

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar detalle"><IconClose /></button>
        <div className={styles.hero}>
          <span className={styles.category}>{product.category || 'Producto'}</span>
          <h2 id="product-modal-title">{product.name}</h2>
          <p>{product.description || 'Un producto listo para formar parte de tu próximo pedido.'}</p>
        </div>
        <div className={styles.content}>
          <FactsList items={[{ label: 'Precio unitario', value: formatCLP(product.price), mono: true }, { label: 'Disponibilidad', value: STOCK_LABEL[level], color: level === 'ok' ? 'var(--green)' : 'var(--brass)' }]} />
          <div className={styles.purchase}>
            <div>
              <span className={styles.purchaseLabel}>¿Cuántas unidades necesitas?</span>
              <div className={styles.stepper}>
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={unavailable || quantity <= 1} aria-label="Disminuir cantidad"><IconMinus /></button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} disabled={unavailable || quantity >= product.stock} aria-label="Aumentar cantidad"><IconPlus /></button>
              </div>
            </div>
            <strong className={styles.total}>{formatCLP(product.price * quantity)}</strong>
          </div>
          <Button variant="primary" block onClick={addToCart} disabled={unavailable}><IconCart /> {unavailable ? 'Producto sin stock' : 'Agregar al carrito'}</Button>
          {(canEdit || canDelete) && (
            <div className={styles.adminActions}>
              {canEdit && <Button onClick={() => onEdit(product)}>Editar producto</Button>}
              {canDelete && <Button variant="danger" onClick={() => onDelete(product)}>Eliminar</Button>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
