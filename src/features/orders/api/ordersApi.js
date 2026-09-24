const BASE = '/api/orders';

export const createOrdersApi = (http) => ({
  list: ({ limit = 25, cursor } = {}) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    return http.get(`${BASE}?${params.toString()}`);
  },
  get: (id) => http.get(`${BASE}/${id}`),
  create: ({ items, customerId, idempotencyKey }) => http.post(
    BASE,
    { ...(customerId && { customerId }), items },
    { headers: { 'Idempotency-Key': idempotencyKey } },
  ),
  updateStatus: (id, status, expectedVersion) => http.put(`${BASE}/${id}/status`, { status, expectedVersion }),
  remove: (id) => http.delete(`${BASE}/${id}`),
});
