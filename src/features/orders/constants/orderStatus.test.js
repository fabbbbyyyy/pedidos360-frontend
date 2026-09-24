import { describe, expect, it } from 'vitest';
import { ORDER_STATUS, TRANSITIONS } from './orderStatus';

describe('transiciones de pedidos', () => {
  it('permite cancelar solo pedidos pendientes o confirmados', () => {
    expect(TRANSITIONS.PENDING).toContain(ORDER_STATUS.CANCELLED);
    expect(TRANSITIONS.CONFIRMED).toContain(ORDER_STATUS.CANCELLED);
    expect(TRANSITIONS.PREPARING).not.toContain(ORDER_STATUS.CANCELLED);
    expect(TRANSITIONS.DELIVERED).not.toContain(ORDER_STATUS.CANCELLED);
  });

  it('mantiene el flujo operativo en orden', () => {
    expect(TRANSITIONS.PENDING).toContain(ORDER_STATUS.CONFIRMED);
    expect(TRANSITIONS.CONFIRMED).toContain(ORDER_STATUS.PREPARING);
    expect(TRANSITIONS.PREPARING).toContain(ORDER_STATUS.READY);
    expect(TRANSITIONS.READY).toContain(ORDER_STATUS.DELIVERED);
  });
});