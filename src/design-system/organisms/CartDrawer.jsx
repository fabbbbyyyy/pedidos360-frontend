import { Button, IconCart, IconClose, IconMinus, IconPlus, IconTrash } from '../atoms';
import { useCart } from '@/core/cart/CartProvider';
import { formatCLP } from '@/shared/utils/format';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, totalItems, totalPrice, isOpen, openCart, closeCart, updateQuantity, removeItem } = useCart();

  return (
    <>
      <button type="button" className={styles.fab} onClick={openCart} aria-label="Abrir carrito">
        <IconCart />
        <span>Carrito</span>
        {totalItems > 0 && <b>{totalItems}</b>}
      </button>

      {isOpen && (
        <div className={styles.layer} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeCart()}>
          <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <header className={styles.header}>
              <div>
                <span className={styles.eyebrow}>Tu selección</span>
                <h2 id="cart-title">Carrito</h2>
              </div>
              <Button variant="ghost" aria-label="Cerrar carrito" onClick={closeCart}><IconClose /></Button>
            </header>

            <div className={styles.body}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}><IconCart /></div>
                  <h3>Tu carrito está vacío</h3>
                  <p>Agrega productos desde el catálogo para preparar tu pedido.</p>
                  <Button variant="primary" onClick={closeCart}>Explorar catálogo</Button>
                </div>
              ) : (
                <div className={styles.items}>
                  {items.map(({ product, quantity }) => (
                    <article className={styles.item} key={product.id}>
                      <div className={styles.itemInfo}>
                        <h3>{product.name}</h3>
                        <span>{formatCLP(product.price)} por unidad</span>
                      </div>
                      <div className={styles.itemBottom}>
                        <div className={styles.stepper} aria-label={`Cantidad de ${product.name}`}>
                          <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} aria-label="Disminuir cantidad"><IconMinus /></button>
                          <strong>{quantity}</strong>
                          <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock} aria-label="Aumentar cantidad"><IconPlus /></button>
                        </div>
                        <strong className={styles.itemTotal}>{formatCLP(product.price * quantity)}</strong>
                        <button type="button" className={styles.remove} onClick={() => removeItem(product.id)} aria-label={`Eliminar ${product.name}`}><IconTrash /></button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <footer className={styles.footer}>
                <div><span>Total estimado</span><strong>{formatCLP(totalPrice)}</strong></div>
                <Button variant="primary" block disabled>Continuar con el pedido</Button>
                <small>La confirmación del pedido estará disponible cuando se conecte el backend.</small>
              </footer>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
