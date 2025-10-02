import api from './api';

export const webseriesApi = {
  getAll: (params: any) => api.get('/webseries', { params }),
  getById: (id: string) => api.get(`/webseries/${id}`),
  search: (q: string, limit = 10) => 
    api.get('/webseries/search', { params: { q, limit } }),
};