import { useMemo, useState } from 'react';
import { useSession } from '@/core/auth/SessionProvider';
import { useCart } from '@/core/cart/CartProvider';
import { Button, Chip, IconGrid, IconList, IconPlus, IconRefresh } from '@/design-system/atoms';
import { FilterSelect, Notice, SearchInput } from '@/design-system/molecules';
import { ConfirmDialog, Topbar } from '@/design-system/organisms';
import { CenteredMessage, PageLayout } from '@/design-system/templates';
import { formatRelativeDate } from '@/shared/utils/format';
import { getStockLevel } from '../constants/stock';
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct, useUploadProductImage } from '../hooks/useCatalog';
import ProductEditorModal from '../components/ProductEditorModal';
import ProductModal from '../components/ProductModal';
import ProductGrid from '../components/ProductCard';
import ProductList from '../components/ProductList';
import styles from './CatalogPage.module.css';

const ALL = 'ALL';
const LOW = 'LOW';

export default function CatalogPage() {
  const { can } = useSession();
  const { addItem } = useCart();
  const productsQuery = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const uploadProductImage = useUploadProductImage();
  const updateProduct = useUpdateProduct();

  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid'); // 'list' | 'grid'
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('view'); // 'view' | 'create' | 'edit'
  const [actionError, setActionError] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

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
  async function handleCreate({ imageFile, ...payload }) {
    try {
      const created = await createProduct.mutateAsync(payload);
      if (imageFile && created?.id) {
        try {
          await uploadProductImage.mutateAsync({ id: created.id, file: imageFile });
        } catch {
          setActionError('El producto se creó, pero no pudimos cargar su imagen. Puedes intentarlo desde el detalle.');
        }
      }
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

  async function handleUploadImage(product, file) {
    setActionError(null);
    try {
      await uploadProductImage.mutateAsync({ id: product.id, file });
      setSelectedId(product.id);
    } catch (error) {
      setActionError(error.message);
    }
  }

  function handleDelete(product) {
    setProductToDelete(product);
  }

  async function confirmDelete() {
    if (!productToDelete) return;
    setActionError(null);
    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      setSelectedId(null);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setProductToDelete(null);
    }
  }

  const Body = view === 'grid' ? ProductGrid : ProductList;
  const updatedAt = productsQuery.dataUpdatedAt ? new Date(productsQuery.dataUpdatedAt).toISOString() : null;

  return (
    <>
      <PageLayout
        header={
          <Topbar title="Catálogo" subtitle={`${products.length} productos · ${lowCount} con stock bajo${updatedAt ? ` · actualizado ${formatRelativeDate(updatedAt)}` : ''}`}>
            <SearchInput placeholder="Buscar producto" value={query} onChange={setQuery} />
            <FilterSelect compact label="Categoría" options={filterOptions} value={category} onChange={setCategory} />
            <div role="group" aria-label="Vista">
              <Chip pressed={view === 'list'} onClick={() => setView('list')}><IconList /> Lista</Chip>
              <Chip pressed={view === 'grid'} onClick={() => setView('grid')}><IconGrid /> Grilla</Chip>
            </div>
            <Button onClick={() => productsQuery.refetch()} disabled={productsQuery.isFetching} aria-label="Actualizar"><IconRefresh /></Button>
            {can('catalog', 'create') && <Button variant="primary" onClick={openCreate}><IconPlus /> Nuevo producto</Button>}
          </Topbar>
        }
        filters={null}
        notice={actionError && mode === 'view' && <Notice variant="error">{actionError}</Notice>}
      >
        {productsQuery.isLoading ? (
          <CenteredMessage title="Cargando catálogo…" />
        ) : productsQuery.isError ? (
          <CenteredMessage title="No se pudo cargar el catálogo">
            <p>{productsQuery.error.message}</p>
            <Button onClick={() => productsQuery.refetch()}>Reintentar</Button>
          </CenteredMessage>
        ) : (
          <div className={styles.catalogCanvas}>
            <Body products={filtered} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setMode('view'); }} />
          </div>
        )}
      </PageLayout>
      {selected && mode === 'view' && (
        <ProductModal
          product={selected}
          canEdit={can('catalog', 'update')}
          canDelete={can('catalog', 'delete')}
          uploadingImage={uploadProductImage.isPending}
          uploadProgress={uploadProductImage.progress}
          uploadError={actionError}
          onClose={() => setSelectedId(null)}
          onAdd={addItem}
          onEdit={openEdit}
          onDelete={handleDelete}
          onUploadImage={handleUploadImage}
        />
      )}
      {(mode === 'create' || (mode === 'edit' && selected)) && (
        <ProductEditorModal
          product={mode === 'edit' ? selected : null}
          categories={categories}
          submitting={mode === 'create' ? createProduct.isPending || uploadProductImage.isPending : updateProduct.isPending}
          error={mode === 'create' ? createProduct.error?.message || uploadProductImage.error?.message : updateProduct.error?.message}
          onSubmit={mode === 'create' ? handleCreate : handleUpdate}
          onClose={() => setMode('view')}
        />
      )}
      {productToDelete && (
        <ConfirmDialog
          title={`¿Eliminar «${productToDelete.name}»?`}
          message="Esta acción no se puede deshacer."
          confirmLabel="Eliminar producto"
          danger
          busy={deleteProduct.isPending}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
