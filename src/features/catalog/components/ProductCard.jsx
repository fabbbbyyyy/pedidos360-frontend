import { EmptyState } from '@/design-system/molecules';
import { ProductImage } from '@/design-system/atoms';
import { formatCLP } from '@/shared/utils/format';
import StockMeter from './StockMeter';
import styles from './ProductCard.module.css';

export function ProductCard({ product, selected, onSelect }) {
  return (
    <button type="button" className={styles.card} aria-pressed={selected} onClick={() => onSelect(product.id)}>
      <div className={styles.top}>
        <ProductImage src={product.imageUrl} alt="" className={styles.cardImage} />
        <div className={styles.cardOverlay} />
        <div className={styles.topContent}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.cat}>{product.category || '—'}</span>
        </div>
      </div>
      <p className={styles.desc}>{product.description}</p>
      <div className={styles.bottom}>
        <span className={styles.price}>{formatCLP(product.price)}</span>
        <StockMeter stock={product.stock} />
      </div>
    </button>
  );
}

// Vista en grilla del catálogo (alternativa a ProductList).
export default function ProductGrid({ products, selectedId, onSelect }) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} selected={product.id === selectedId} onSelect={onSelect} />
      ))}
      {products.length === 0 && (
        <div className={styles.empty}>
          <EmptyState title="No hay productos que coincidan">
            <p>Prueba con otro término de búsqueda o cambia la categoría.</p>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
