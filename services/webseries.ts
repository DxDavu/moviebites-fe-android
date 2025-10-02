import api from './api';

export const webseriesApi = {
  getAll: (params: any) => api.get('/webseries', { params }),
  getById: (id: string) => api.get(`/webseries/${id}`),
  getBySlug: (slug: string) => api.get(`/webseries/${slug}`),
  search: (q: string, limit = 10) => api.get('/webseries/search', { params: { q, limit } }),
  create: (data: any) => api.post('/webseries', data),
  update: (id: string, data: any) => api.put(`/webseries/${id}`, data),
  remove: (id: string) => api.delete(`/webseries/${id}`),
};