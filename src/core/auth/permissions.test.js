import { describe, expect, it } from 'vitest';
import { PERMISSIONS } from './permissions';
import { ROLES } from './roles';

describe('permisos de la interfaz', () => {
  it('reserva la administración del catálogo para admin', () => {
    expect(PERMISSIONS.catalog.create).toEqual([ROLES.ADMIN]);
    expect(PERMISSIONS.catalog.update).toEqual([ROLES.ADMIN]);
    expect(PERMISSIONS.catalog.delete).toEqual([ROLES.ADMIN]);
  });

  it('permite consultar catálogo y pedidos según la matriz definida', () => {
    expect(PERMISSIONS.catalog.read).toEqual([ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE]);
    expect(PERMISSIONS.orders.read).toEqual([ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE]);
    expect(PERMISSIONS.orders.create).toEqual([ROLES.ADMIN, ROLES.OPERADOR, ROLES.CLIENTE]);
  });
});