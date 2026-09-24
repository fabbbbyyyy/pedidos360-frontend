const BASE = '/api/orders';

export const createOrdersApi = (http) => ({
  list: () => http.get(BASE),
  get: (id) => http.get(`${BASE}/${id}`),
  create: ({ items, idempotencyKey }) => http.post(BASE, { items }, { headers: { 'Idempotency-Key': idempotencyKey } }),
  updateStatus: (id, status, expectedVersion) => http.put(`${BASE}/${id}/status`, { status, expectedVersion }),
  remove: (id) => http.delete(`${BASE}/${id}`),
});
