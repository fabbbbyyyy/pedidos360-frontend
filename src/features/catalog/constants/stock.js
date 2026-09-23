// El backend no maneja "stock mínimo" por producto, así que el umbral es global y vive acá.
export const LOW_STOCK_THRESHOLD = 10;

export function getStockLevel(stock) {
  if (stock <= 0) return 'out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
}
