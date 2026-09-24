import { useEffect, useState } from 'react';
import { Input, ProductImage, Textarea } from '@/design-system/atoms';
import { Field, Notice } from '@/design-system/molecules';
import styles from './ProductForm.module.css';
import { validateProductImage } from '../constants/images';

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl ?? null);

  useEffect(() => () => imagePreview?.startsWith('blob:') && URL.revokeObjectURL(imagePreview), [imagePreview]);

  const set = (field) => (event) => setValues((v) => ({ ...v, [field]: event.target.value }));

  function handleImageChange(event) {
    const file = event.target.files?.[0] ?? null;
    const imageError = validateProductImage(file);
    if (imageError) {
      setValidation(imageError);
      event.target.value = '';
      return;
    }
    setValidation(null);
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : product?.imageUrl ?? null);
  }

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
    if (imageFile) payload.imageFile = imageFile;
    onSubmit(payload);
  }

  return (
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

        {!editing && (
          <Field label="Imagen del producto" hint="JPG, PNG, WEBP o GIF · máximo 5 MB">
            <label className={styles.imagePicker}>
              <ProductImage src={imagePreview} alt="Vista previa del producto" />
              <span>{imageFile ? imageFile.name : 'Seleccionar imagen'}</span>
              <Input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} className={styles.fileInput} />
            </label>
          </Field>
        )}

        {validation && <Notice variant="error">{validation}</Notice>}
        {error && <Notice variant="error">{error}</Notice>}
      </form>
  );
}
