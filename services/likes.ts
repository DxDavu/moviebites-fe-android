import api from './api';

export const likesApi = {
  // Check if a user liked a webseries or specific episode
  check: (webseriesId: string, params: { social_id?: string; episode_number?: number } = {}) =>
    api.get(`/likes/${webseriesId}/like`, { params }),

  // Add a like (body should include social_id and optional episode_number)
  add: (webseriesId: string, data: { social_id: string; episode_number?: number }) =>
    api.post(`/likes/${webseriesId}/like`, data),

  // Remove a like (body should include social_id and optional episode_number)
  remove: (webseriesId: string, data: { social_id: string; episode_number?: number }) =>
    api.delete(`/likes/${webseriesId}/like`, { data }),

  // Get like count for a webseries
  getCount: (webseriesId: string) => api.get(`/likes/${webseriesId}/like/count`),
};
