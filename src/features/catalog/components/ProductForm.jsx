import { useState } from 'react';
import { Button, Input, Textarea } from '@/design-system/atoms';
import { Field, Notice } from '@/design-system/molecules';
import { DetailPanel } from '@/design-system/organisms';
import styles from './ProductForm.module.css';

// Alta (product = null) y edición de producto. Solo admin (lo controla la página).
export default function ProductForm({ product, categories, submitting, error, onSubmit, onCancel }) {
  const editing = Boolean(product);
  const [values, setValues] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    stock: product?.stock ?? '',
    category: product?.category ?? '',
  });
  const [validation, setValidation] = useState(null);

  const set = (field) => (event) => setValues((v) => ({ ...v, [field]: event.target.value }));

  function handleSubmit(event) {
    event.preventDefault();
    const price = Number(values.price);
    const stock = Number(values.stock);

    if (!values.name.trim()) return setValidation('El nombre es obligatorio.');
    if (values.price === '' || !Number.isFinite(price) || price < 0) return setValidation('El precio debe ser un número mayor o igual a 0.');
    if (values.stock === '' || !Number.isInteger(stock) || stock < 0) return setValidation('El stock debe ser un entero mayor o igual a 0.');
    setValidation(null);

    const payload = { name: values.name.trim(), price, stock };
    const description = values.description.trim();
    const category = values.category.trim();
    // En la edición se envían siempre (permite vaciarlos); en el alta solo si tienen valor.
    if (editing || description) payload.description = description;
    if (editing || category) payload.category = category;
    onSubmit(payload);
  }

  return (
    <DetailPanel
      title={editing ? 'Editar producto' : 'Nuevo producto'}
      subtitle={editing ? product.id : undefined}
      onClose={onCancel}
      footer={
        <>
          <Button variant="primary" block type="submit" form="product-form" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>Descartar</Button>
        </>
      }
    >
      <form id="product-form" className={styles.form} onSubmit={handleSubmit}>
        <Field label="Nombre">
          <Input value={values.name} onChange={set('name')} placeholder="Nombre del producto" />
        </Field>
        <Field label="Descripción">
          <Textarea value={values.description} onChange={set('description')} placeholder="Opcional" />
        </Field>
        <div className={styles.pair}>
          <Field label="Precio (CLP)">
            <Input type="number" min="0" step="1" value={values.price} onChange={set('price')} />
          </Field>
          <Field label="Stock (unidades)">
            <Input type="number" min="0" step="1" value={values.stock} onChange={set('stock')} />
          </Field>
        </div>
        <Field label="Categoría">
          <Input value={values.category} onChange={set('category')} list="catalog-categories" placeholder="Opcional" />
          <datalist id="catalog-categories">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Field>

        {validation && <Notice variant="error">{validation}</Notice>}
        {error && <Notice variant="error">{error}</Notice>}
      </form>
    </DetailPanel>
  );
}
