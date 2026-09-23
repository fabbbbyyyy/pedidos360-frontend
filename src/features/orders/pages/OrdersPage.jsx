import { useMemo, useState } from 'react';
import { useSession } from '@/core/auth/SessionProvider';
import { ROLES } from '@/core/auth/roles';
import { Button, IconPlus, IconRefresh } from '@/design-system/atoms';
import { FilterChips, Notice, SearchInput } from '@/design-system/molecules';
import { PanelPlaceholder, Topbar } from '@/design-system/organisms';
import { CenteredMessage, PageLayout } from '@/design-system/templates';
import { formatRelativeDate } from '@/shared/utils/format';
import { useProducts } from '@/features/catalog/hooks/useCatalog';
import { ORDER_STATUS, ORDER_STATUSES, STATUS_LABEL, STATUS_TONE } from '../constants/orderStatus';
import { getOrderActions } from '../utils/orderActions';
import { scopeOrdersToUser, sortByNewest } from '../utils/scopeOrders';
import { useCreateOrder, useDeleteOrder, useOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import OrderDetail from '../components/OrderDetail';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';

const ALL = 'ALL';

export default function OrdersPage() {
  const session = useSession();
  const { can, hasRole, user } = session;

  const ordersQuery = useOrders();
  const productsQuery = useProducts(); // nombres de producto y alta de pedidos
  const createOrder = useCreateOrder();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const [filter, setFilter] = useState(ALL);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState(null);

  const products = productsQuery.data ?? [];
  const productsById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const orders = useMemo(
    () => sortByNewest(scopeOrdersToUser(ordersQuery.data ?? [], { user, hasRole })),
    [ordersQuery.data, user, hasRole],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === ALL || order.status === filter;
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        String(order.customerId).toLowerCase().includes(q) ||
        (order.createdBy ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, filter, query]);

  const selected = filtered.find((o) => o.id === selectedId) ?? null;
  const busy = updateStatus.isPending || deleteOrder.isPending;

  const filterOptions = [
    { key: ALL, label: 'Todos', count: orders.length },
    ...ORDER_STATUSES.map((status) => ({
      key: status,
      label: STATUS_LABEL[status],
      dot: STATUS_TONE[status].dot,
      count: orders.filter((o) => o.status === status).length,
    })),
  ];

  async function run(action) {
    setActionError(null);
    try {
      await action();
    } catch (error) {
      setActionError(error.message);
    }
  }

  const handleAdvance = (order, status) => run(() => updateStatus.mutateAsync({ id: order.id, status }));

  const handleCancel = (order) => {
    if (!window.confirm('¿Cancelar este pedido? El stock no se repone automáticamente.')) return;
    return run(() => updateStatus.mutateAsync({ id: order.id, status: ORDER_STATUS.CANCELLED }));
  };

  const handleDelete = (order) => {
    if (!window.confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return;
    return run(async () => {
      await deleteOrder.mutateAsync(order.id);
      setSelectedId(null);
    });
  };

  function openCreate() {
    createOrder.reset();
    setSelectedId(null);
    setCreating(true);
  }

  async function handleCreate(payload) {
    try {
      const created = await createOrder.mutateAsync(payload);
      setCreating(false);
      setFilter(ALL);
      setSelectedId(created?.id ?? null);
    } catch { /* el error se muestra en el formulario */ }
  }

  let panel;
  if (creating) {
    const isClient = !hasRole(ROLES.ADMIN, ROLES.OPERADOR);
    panel = (
      <OrderForm
        products={products}
        customerId={isClient ? user.id : ''}
        lockCustomer={isClient}
        submitting={createOrder.isPending}
        error={createOrder.error?.message}
        onSubmit={handleCreate}
        onCancel={() => setCreating(false)}
      />
    );
  } else if (selected) {
    panel = (
      <OrderDetail
        order={selected}
        productsById={productsById}
        actions={getOrderActions(selected.status, session)}
        busy={busy}
        onClose={() => setSelectedId(null)}
        onAdvance={handleAdvance}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    );
  } else {
    panel = (
      <PanelPlaceholder title="Sin pedido abierto" subtitle="Elige una fila para ver el detalle" emptyTitle="Nada seleccionado">
        <p>Al elegir un pedido verás sus ítems, el total y las acciones disponibles para tu rol.</p>
      </PanelPlaceholder>
    );
  }

  const updatedAt = ordersQuery.dataUpdatedAt ? new Date(ordersQuery.dataUpdatedAt).toISOString() : null;

  return (
    <PageLayout
      header={
        <Topbar title="Pedidos" subtitle={updatedAt ? `Actualizado ${formatRelativeDate(updatedAt)}` : 'Cargando…'}>
          <SearchInput placeholder="Buscar por cliente o ID" value={query} onChange={setQuery} />
          <Button onClick={() => ordersQuery.refetch()} disabled={ordersQuery.isFetching} aria-label="Actualizar">
            <IconRefresh />
          </Button>
          {can('orders', 'create') && (
            <Button variant="primary" onClick={openCreate}><IconPlus /> Nuevo pedido</Button>
          )}
        </Topbar>
      }
      filters={<FilterChips label="Filtrar por estado" options={filterOptions} value={filter} onChange={setFilter} />}
      notice={actionError && <Notice variant="error">{actionError}</Notice>}
      panel={panel}
    >
      {ordersQuery.isLoading ? (
        <CenteredMessage title="Cargando pedidos…" />
      ) : ordersQuery.isError ? (
        <CenteredMessage title="No se pudieron cargar los pedidos">
          <p>{ordersQuery.error.message}</p>
          <Button onClick={() => ordersQuery.refetch()}>Reintentar</Button>
        </CenteredMessage>
      ) : (
        <OrderList orders={filtered} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setCreating(false); }} />
      )}
    </PageLayout>
  );
}
