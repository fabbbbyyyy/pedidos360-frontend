import { Button } from '@/design-system/atoms';
import { FactsList, Notice } from '@/design-system/molecules';
import { DetailPanel, PanelDivider, PanelSectionTitle } from '@/design-system/organisms';
import { formatCLP, formatFullDate } from '@/shared/utils/format';
import { getStockLevel } from '../constants/stock';
import styles from './ProductDetail.module.css';

const STOCK_COLOR = { out: 'var(--brick)', low: 'var(--brass)', ok: undefined };

export default function ProductDetail({ product, canEdit, canDelete, busy, onClose, onEdit, onDelete }) {
  const level = getStockLevel(product.stock);

  return (
    <DetailPanel
      title={product.name}
      subtitle={product.id}
      onClose={onClose}
      footer={
        (canEdit || canDelete) && (
          <>
            {canEdit && <Button variant="primary" block disabled={busy} onClick={() => onEdit(product)}>Editar producto</Button>}
            {canDelete && <Button variant="danger" disabled={busy} onClick={() => onDelete(product)}>Eliminar</Button>}
          </>
        )
      }
    >
      <FactsList
        items={[
          { label: 'Categoría', value: product.category || '—' },
          { label: 'Precio', value: formatCLP(product.price), mono: true },
          { label: 'Stock', value: `${product.stock} unidades`, mono: true, color: STOCK_COLOR[level] },
          { label: 'Creado', value: formatFullDate(product.createdAt) },
          { label: 'Última actualización', value: formatFullDate(product.updatedAt) },
        ]}
      />

      <PanelDivider />

      <PanelSectionTitle>Descripción</PanelSectionTitle>
      <p className={styles.desc}>{product.description || 'Sin descripción.'}</p>

      {level === 'out' && (
        <Notice variant="error" className={styles.note}>
          Producto agotado. Estará disponible nuevamente cuando se reponga el inventario.
        </Notice>
      )}
      {level === 'low' && (
        <Notice variant="warning" className={styles.note}>
          Disponibilidad limitada: quedan {product.stock} unidades.
        </Notice>
      )}
    </DetailPanel>
  );
}
