import { useMemo, useState } from 'react';
import { useSession } from '@/core/auth/SessionProvider';
import { Button, Chip, IconGrid, IconList, IconPlus, IconRefresh } from '@/design-system/atoms';
import { FilterChips, Notice, SearchInput } from '@/design-system/molecules';
import { PanelPlaceholder, Topbar } from '@/design-system/organisms';
import { CenteredMessage, PageLayout } from '@/design-system/templates';
import { formatRelativeDate } from '@/shared/utils/format';
import { getStockLevel } from '../constants/stock';
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from '../hooks/useCatalog';
import ProductDetail from '../components/ProductDetail';
import ProductForm from '../components/ProductForm';
import ProductGrid from '../components/ProductCard';
import ProductList from '../components/ProductList';

const ALL = 'ALL';
const LOW = 'LOW';

export default function CatalogPage() {
  const { can } = useSession();
  const productsQuery = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'grid'
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('view'); // 'view' | 'create' | 'edit'
  const [actionError, setActionError] = useState(null);

  const products = useMemo(
    () => [...(productsQuery.data ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [productsQuery.data],
  );
  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products]);
  const lowCount = products.filter((p) => getStockLevel(p.stock) !== 'ok').length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        category === ALL || (category === LOW ? getStockLevel(p.stock) !== 'ok' : p.category === category);
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  const selected = filtered.find((p) => p.id === selectedId) ?? null;
  const busy = updateProduct.isPending || deleteProduct.isPending;

  const filterOptions = [
    { key: ALL, label: 'Todas', count: products.length },
    ...categories.map((c) => ({ key: c, label: c, count: products.filter((p) => p.category === c).length })),
    { key: LOW, label: 'Stock bajo', dot: 'var(--brick)', count: lowCount },
  ];

  function openCreate() {
    createProduct.reset();
    setSelectedId(null);
    setMode('create');
  }
  function openEdit() {
    updateProduct.reset();
    setMode('edit');
  }

  async function handleCreate(payload) {
    try {
      const created = await createProduct.mutateAsync(payload);
      setMode('view');
      setCategory(ALL);
      setSelectedId(created?.id ?? null);
    } catch { /* el error se muestra en el formulario */ }
  }

  async function handleUpdate(payload) {
    try {
      await updateProduct.mutateAsync({ id: selected.id, ...payload });
      setMode('view');
    } catch { /* idem */ }
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar «${product.name}»? Esta acción no se puede deshacer.`)) return;
    setActionError(null);
    try {
      await deleteProduct.mutateAsync(product.id);
      setSelectedId(null);
    } catch (error) {
      setActionError(error.message);
    }
  }

  let panel;
  if (mode === 'create') {
    panel = (
      <ProductForm
        key="create"
        product={null}
        categories={categories}
        submitting={createProduct.isPending}
        error={createProduct.error?.message}
        onSubmit={handleCreate}
        onCancel={() => setMode('view')}
      />
    );
  } else if (mode === 'edit' && selected) {
    panel = (
      <ProductForm
        key={selected.id}
        product={selected}
        categories={categories}
        submitting={updateProduct.isPending}
        error={updateProduct.error?.message}
        onSubmit={handleUpdate}
        onCancel={() => setMode('view')}
      />
    );
  } else if (selected) {
    panel = (
      <ProductDetail
        product={selected}
        canEdit={can('catalog', 'update')}
        canDelete={can('catalog', 'delete')}
        busy={busy}
        onClose={() => setSelectedId(null)}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    );
  } else {
    panel = (
      <PanelPlaceholder title="Sin producto abierto" subtitle="Elige un producto para ver el detalle" emptyTitle="Nada seleccionado">
        <p>Al elegir un producto verás su precio, stock y descripción.</p>
        {lowCount > 0 && <Button onClick={() => setCategory(LOW)}>Ver productos con stock bajo</Button>}
      </PanelPlaceholder>
    );
  }

  const Body = view === 'grid' ? ProductGrid : ProductList;
  const updatedAt = productsQuery.dataUpdatedAt ? new Date(productsQuery.dataUpdatedAt).toISOString() : null;

  return (
    <PageLayout
      header={
        <Topbar title="Catálogo" subtitle={`${products.length} productos · ${lowCount} con stock bajo${updatedAt ? ` · actualizado ${formatRelativeDate(updatedAt)}` : ''}`}>
          <SearchInput placeholder="Buscar producto" value={query} onChange={setQuery} />
          <div role="group" aria-label="Vista">
            <Chip pressed={view === 'list'} onClick={() => setView('list')}><IconList /> Lista</Chip>
            <Chip pressed={view === 'grid'} onClick={() => setView('grid')}><IconGrid /> Grilla</Chip>
          </div>
          <Button onClick={() => productsQuery.refetch()} disabled={productsQuery.isFetching} aria-label="Actualizar"><IconRefresh /></Button>
          {can('catalog', 'create') && <Button variant="primary" onClick={openCreate}><IconPlus /> Nuevo producto</Button>}
        </Topbar>
      }
      filters={<FilterChips label="Filtrar por categoría" options={filterOptions} value={category} onChange={setCategory} />}
      notice={actionError && <Notice variant="error">{actionError}</Notice>}
      panel={panel}
    >
      {productsQuery.isLoading ? (
        <CenteredMessage title="Cargando catálogo…" />
      ) : productsQuery.isError ? (
        <CenteredMessage title="No se pudo cargar el catálogo">
          <p>{productsQuery.error.message}</p>
          <Button onClick={() => productsQuery.refetch()}>Reintentar</Button>
        </CenteredMessage>
      ) : (
        <Body products={filtered} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setMode('view'); }} />
      )}
    </PageLayout>
  );
}
