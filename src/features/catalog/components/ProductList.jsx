import { EmptyState } from '@/design-system/molecules';
import { ProductImage } from '@/design-system/atoms';
import { formatCLP, formatRelativeDate } from '@/shared/utils/format';
import StockMeter from './StockMeter';
import styles from './ProductList.module.css';

export default function ProductList({ products, selectedId, onSelect }) {
  if (products.length === 0) return <div className={styles.empty}><EmptyState title="No hay productos que coincidan"><p>Prueba con otro término de búsqueda o cambia la categoría.</p></EmptyState></div>;

  return <div className={styles.list}>
    {products.map((product) => (
      <button type="button" className={styles.row} key={product.id} aria-pressed={product.id === selectedId} onClick={() => onSelect(product.id)}>
        <div className={styles.product}><ProductImage src={product.imageUrl} alt="" className={styles.thumbnail} /><div className={styles.productCopy}><div className={styles.name}>{product.name}</div><div className={styles.description}>{product.description || 'Sin descripción disponible'}</div></div></div>
        <div><span className={styles.label}>Categoría</span><span className={styles.value}>{product.category || 'General'}</span></div>
        <div><span className={styles.label}>Precio</span><span className={styles.price}>{formatCLP(product.price)}</span></div>
        <div><span className={styles.label}>Disponibilidad</span><StockMeter stock={product.stock} /></div>
        <div className={styles.date}>{formatRelativeDate(product.updatedAt)}</div>
        <span className={styles.arrow} aria-hidden="true">›</span>
      </button>
    ))}
  </div>;
}
