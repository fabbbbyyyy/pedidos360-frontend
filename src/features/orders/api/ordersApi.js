const BASE = '/api/orders';

export const createOrdersApi = (http) => ({
  list: () => http.get(BASE),
  get: (id) => http.get(`${BASE}/${id}`),
  create: (payload) => http.post(BASE, payload), // { customerId, items: [{ productId, quantity, unitPrice }] }
  updateStatus: (id, status) => http.put(`${BASE}/${id}/status`, { status }),
  remove: (id) => http.delete(`${BASE}/${id}`),
});
