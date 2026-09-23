import { cx } from '@/shared/utils/cx';
import { EmptyState } from '../molecules';
import styles from './DataTable.module.css';

// Tabla genérica. columns: [{ key, header, width?, align?: 'right', render(row) }]
// El scroll lo aporta el contenedor (PageLayout), para que el encabezado quede fijo.
export function DataTable({ columns, rows, getRowId, selectedId, onSelect, emptyTitle, emptyHint }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ width: col.width }} className={cx(col.align === 'right' && styles.right)}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const id = getRowId(row);
          const select = () => onSelect?.(id);
          return (
            <tr
              key={id}
              aria-selected={id === selectedId}
              tabIndex={0}
              onClick={select}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  select();
                }
              }}
            >
              {columns.map((col) => (
                <td key={col.key} className={cx(col.align === 'right' && styles.right)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          );
        })}
        {rows.length === 0 && (
          <tr className={styles.emptyRow}>
            <td colSpan={columns.length}>
              <EmptyState title={emptyTitle}>{emptyHint && <p>{emptyHint}</p>}</EmptyState>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// ---- Primitivas para el contenido de las celdas ----
export const CellId = ({ children }) => <span className={styles.id}>{children}</span>;
export const CellMoney = ({ children }) => <span className={styles.money}>{children}</span>;
export const CellMeta = ({ children }) => <span className={styles.meta}>{children}</span>;
export const CellStack = ({ title, meta }) => (
  <>
    <div className={styles.cust}>{title}</div>
    {meta && <div className={styles.meta}>{meta}</div>}
  </>
);
