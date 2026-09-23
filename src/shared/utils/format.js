const clp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});
const relative = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const short = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' });
const full = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

export const formatCLP = (value) => clp.format(Number(value) || 0);

export function formatRelativeDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const seconds = (date.getTime() - Date.now()) / 1000;
  if (Math.abs(seconds) > 30 * 86400) return short.format(date);
  for (const [unit, size] of [['day', 86400], ['hour', 3600], ['minute', 60]]) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return 'ahora';
}

export function formatFullDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : full.format(date);
}
