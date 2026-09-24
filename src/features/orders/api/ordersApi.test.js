import { describe, expect, it, vi } from 'vitest';
import { createOrdersApi } from './ordersApi';

describe('contrato de creación de pedidos', () => {
  it('envía items e idempotency key sin precio', async () => {
    const http = { post: vi.fn().mockResolvedValue({ id: 'order-1' }) };
    const api = createOrdersApi(http);
    const items = [{ productId: 'product-1', quantity: 2 }];

    await api.create({ items, idempotencyKey: 'checkout-1' });

    expect(http.post).toHaveBeenCalledWith(
      '/api/orders',
      { items },
      { headers: { 'Idempotency-Key': 'checkout-1' } },
    );
  });

  it('permite customerId explícito para flujos administrativos', async () => {
    const http = { post: vi.fn().mockResolvedValue({ id: 'order-2' }) };
    const api = createOrdersApi(http);
    const items = [{ productId: 'product-1', quantity: 1 }];

    await api.create({ customerId: 'customer-1', items, idempotencyKey: 'checkout-2' });

    expect(http.post).toHaveBeenCalledWith(
      '/api/orders',
      { customerId: 'customer-1', items },
      { headers: { 'Idempotency-Key': 'checkout-2' } },
    );
  });
});