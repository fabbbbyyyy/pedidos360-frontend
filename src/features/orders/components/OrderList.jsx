import { CellId, CellMeta, CellMoney, CellStack, DataTable } from '@/design-system/organisms';
import { formatCLP, formatRelativeDate } from '@/shared/utils/format';
import OrderStatusBadge from './OrderStatusBadge';

const columns = [
  { key: 'id', header: 'Pedido', width: 96, render: (o) => <CellId>{o.id.slice(0, 8)}</CellId> },
  { key: 'customer', header: 'Cliente', render: (o) => <CellStack title={o.customerId} meta={o.createdBy} /> },
  { key: 'items', header: 'Ítems', width: 70, align: 'right', render: (o) => <span className="num">{o.items?.length ?? 0}</span> },
  { key: 'total', header: 'Total', width: 110, align: 'right', render: (o) => <CellMoney>{formatCLP(o.total)}</CellMoney> },
  { key: 'status', header: 'Estado', width: 130, render: (o) => <OrderStatusBadge status={o.status} /> },
  { key: 'createdAt', header: 'Creado', width: 120, align: 'right', render: (o) => <CellMeta>{formatRelativeDate(o.createdAt)}</CellMeta> },
];

export default function OrderList({ orders, selectedId, onSelect }) {
  return (
    <DataTable
      columns={columns}
      rows={orders}
      getRowId={(order) => order.id}
      selectedId={selectedId}
      onSelect={onSelect}
      emptyTitle="No hay pedidos que coincidan"
      emptyHint="Prueba con otro término de búsqueda o cambia el filtro de estado."
    />
  );
}
