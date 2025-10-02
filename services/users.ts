import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const usersApi = {
  // Mobile upsert user endpoint per Postman collection
  // Expect backend to return social_id or user object
  upsert: async (data: { social_id?: string; email?: string; password?: string; name?: string }) => {
    // Ensure we send device udid and user_type as expected by backend
    const udid = (await AsyncStorage.getItem('udid')) || undefined;
    const payload = { ...data, udid, user_type: 'mobile' } as any;
    return api.post('/users/mobile/upsert', payload);
  },

  // Basic login endpoint stub (if backend supports it)
  login: async (data: { email?: string; password?: string; social_id?: string }) => {
    const udid = (await AsyncStorage.getItem('udid')) || undefined;
    const payload = { ...data, udid, user_type: 'mobile' } as any;
    return api.post('/users/login', payload);
  },

  // Get user likes (per postman collection)
  likes: (params: { social_id: string; includeEpisodes?: boolean; episode_id?: string; episode_number?: number }) =>
    api.get('/users/likes', { params }),
};
