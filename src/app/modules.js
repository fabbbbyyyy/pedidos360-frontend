import dashboard from '@/features/dashboard';
import orders from '@/features/orders';
import catalog from '@/features/catalog';

// REGISTRO DE MÓDULOS
// Para agregar uno nuevo: crea src/features/<modulo>/ con un index.js que exporte
// { id, path, label, icon, roles, Page } y agrégalo a esta lista. El router y el
// menú lateral se generan solos, filtrados por rol.
export const modules = [dashboard, orders, catalog];
