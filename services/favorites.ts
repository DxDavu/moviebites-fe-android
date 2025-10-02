import api from './api';

export const favoritesApi = {
  // Check favorite for webseries or specific episode
  check: (webseriesId: string, params: { social_id?: string; episode_number?: number } = {}) =>
    api.get(`/favorites/${webseriesId}/favorite`, { params }),

  // Add favorite
  add: (webseriesId: string, data: { social_id: string; episode_number?: number }) =>
    api.post(`/favorites/${webseriesId}/favorite`, data),

  // Remove favorite
  remove: (webseriesId: string, data: { social_id: string; episode_number?: number }) =>
    api.delete(`/favorites/${webseriesId}/favorite`, { data }),

  // Get favorite count
  getCount: (webseriesId: string) => api.get(`/favorites/${webseriesId}/favorite/count`),
};
