import { CellId, CellMeta, CellMoney, CellStack, DataTable } from '@/design-system/organisms';
import { formatCLP, formatRelativeDate } from '@/shared/utils/format';
import StockMeter from './StockMeter';

const columns = [
  { key: 'id', header: 'Código', width: 84, render: (p) => <CellId>{p.id.slice(0, 8)}</CellId> },
  { key: 'name', header: 'Producto', render: (p) => <CellStack title={p.name} meta={p.description} /> },
  { key: 'category', header: 'Categoría', width: 100, render: (p) => <CellMeta>{p.category || '—'}</CellMeta> },
  { key: 'price', header: 'Precio', width: 100, align: 'right', render: (p) => <CellMoney>{formatCLP(p.price)}</CellMoney> },
  { key: 'stock', header: 'Stock', width: 110, align: 'right', render: (p) => <StockMeter stock={p.stock} /> },
  { key: 'updatedAt', header: 'Actualizado', width: 100, align: 'right', render: (p) => <CellMeta>{formatRelativeDate(p.updatedAt)}</CellMeta> },
];

export default function ProductList({ products, selectedId, onSelect }) {
  return (
    <DataTable
      columns={columns}
      rows={products}
      getRowId={(product) => product.id}
      selectedId={selectedId}
      onSelect={onSelect}
      emptyTitle="No hay productos que coincidan"
      emptyHint="Prueba con otro término de búsqueda o cambia la categoría."
    />
  );
}
