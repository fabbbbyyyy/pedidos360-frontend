import { ROLES } from './roles';

// Espejo de libs/constants/permissions.js del backend.
// Sirve para decidir qué muestra la UI; la validación real siempre ocurre en el backend.
export const PERMISSIONS = {
  catalog: {
    create: [ROLES.ADMIN],
    read: [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  orders: {
    create: [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE],
    read: [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE],
    updateStatus: [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE],
    delete: [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE],
  },
};
