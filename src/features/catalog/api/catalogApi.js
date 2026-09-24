const BASE = '/api/catalog';

export const createCatalogApi = (http) => ({
  list: () => http.get(BASE),
  get: (id) => http.get(`${BASE}/${id}`),
  create: (payload) => http.post(BASE, payload), // { name, description?, price, stock, category? }
  requestImageUpload: (id, payload) => http.post(`${BASE}/${id}/image-url`, payload),
  update: (id, payload) => http.put(`${BASE}/${id}`, payload), // campos parciales
  remove: (id) => http.delete(`${BASE}/${id}`),
});
