import { useMemo, useState } from 'react';
import { Button, IconClose, IconPlus, Input, Select } from '@/design-system/atoms';
import { Field, Notice } from '@/design-system/molecules';
import { DetailPanel, PanelSectionTitle } from '@/design-system/organisms';
import { formatCLP } from '@/shared/utils/format';
import styles from './OrderForm.module.css';

let sequence = 0;
const newItem = () => ({ key: ++sequence, productId: '', quantity: '1' });

// Alta de pedido. Los precios se toman del catálogo (unitPrice = price del producto).
// Un mismo producto no puede repetirse: DynamoDB no admite dos operaciones sobre el mismo
// ítem dentro de una transacción, y el backend respondería 409.
export default function OrderForm({ products, customerId: initialCustomer, lockCustomer, submitting, error, onSubmit, onCancel }) {
  const [customerId, setCustomerId] = useState(initialCustomer ?? '');
  const [items, setItems] = useState([newItem()]);
  const [validation, setValidation] = useState(null);

  const productsById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const sellable = useMemo(() => products.filter((p) => p.stock > 0), [products]);

  const patchItem = (key, patch) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  const removeItem = (key) => setItems((list) => (list.length > 1 ? list.filter((i) => i.key !== key) : list));

  const total = items.reduce((sum, item) => {
    const product = productsById[item.productId];
    const quantity = Number(item.quantity);
    return product && quantity > 0 ? sum + product.price * quantity : sum;
  }, 0);

  function handleSubmit(event) {
    event.preventDefault();
    if (!customerId.trim()) return setValidation('Indica el cliente del pedido.');

    const payloadItems = [];
    for (const item of items) {
      const product = productsById[item.productId];
      const quantity = Number(item.quantity);
      if (!product) return setValidation('Elige un producto en cada ítem.');
      if (!Number.isInteger(quantity) || quantity < 1) return setValidation('La cantidad debe ser un entero mayor a 0.');
      if (quantity > product.stock) return setValidation(`Stock insuficiente para «${product.name}» (disponible: ${product.stock}).`);
      payloadItems.push({ productId: product.id, quantity, unitPrice: product.price });
    }
    setValidation(null);
    onSubmit({ customerId: customerId.trim(), items: payloadItems });
  }

  return (
    <DetailPanel
      title="Nuevo pedido"
      subtitle="Los precios se toman del catálogo"
      onClose={onCancel}
      footer={
        <>
          <Button variant="primary" block type="submit" form="order-form" disabled={submitting}>
            {submitting ? 'Creando…' : 'Crear pedido'}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>Descartar</Button>
        </>
      }
    >
      <form id="order-form" className={styles.form} onSubmit={handleSubmit}>
        <Field label="Cliente" hint={lockCustomer ? 'El pedido se crea a tu nombre.' : 'ID del cliente que hace el pedido.'}>
          <Input value={customerId} onChange={(e) => setCustomerId(e.target.value)} disabled={lockCustomer} placeholder="ID de cliente" />
        </Field>

        <div>
          <PanelSectionTitle>Ítems del pedido</PanelSectionTitle>
          <div className={styles.rows}>
            {items.map((item) => {
              const product = productsById[item.productId];
              const takenElsewhere = new Set(items.filter((i) => i.key !== item.key).map((i) => i.productId));
              return (
                <div className={styles.row} key={item.key}>
                  <Select aria-label="Producto" value={item.productId} onChange={(e) => patchItem(item.key, { productId: e.target.value })}>
                    <option value="">Elige un producto…</option>
                    {sellable.filter((p) => !takenElsewhere.has(p.id)).map((p) => (
                      <option key={p.id} value={p.id}>{p.name} · stock {p.stock}</option>
                    ))}
                  </Select>
                  <Input type="number" min="1" step="1" aria-label="Cantidad" value={item.quantity} onChange={(e) => patchItem(item.key, { quantity: e.target.value })} />
                  <Button variant="ghost" aria-label="Quitar ítem" disabled={items.length === 1} onClick={() => removeItem(item.key)}>
                    <IconClose />
                  </Button>
                  {product && (
                    <div className={styles.lineInfo}>
                      {formatCLP(product.price)} × {Number(item.quantity) || 0} = {formatCLP(product.price * (Number(item.quantity) || 0))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Button variant="ghost" onClick={() => setItems((list) => [...list, newItem()])} disabled={items.length >= sellable.length}>
            <IconPlus /> Agregar ítem
          </Button>
        </div>

        <div className={styles.sum}>
          <span>Total</span>
          <b>{formatCLP(total)}</b>
        </div>

        {sellable.length === 0 && <Notice variant="warning">No hay productos con stock disponible.</Notice>}
        {validation && <Notice variant="error">{validation}</Notice>}
        {error && <Notice variant="error">{error}</Notice>}
      </form>
    </DetailPanel>
  );
}
