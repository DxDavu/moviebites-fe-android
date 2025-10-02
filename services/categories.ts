import api from './api';

export const categoriesApi = {
  getAll: (params: any) => api.get('/categories', { params }),
  search: (q: string, params: any = {}) => api.get('/categories', { params: { q, ...params } }),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  remove: (id: string) => api.delete(`/categories/${id}`),
};
