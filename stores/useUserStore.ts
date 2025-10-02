import { usersApi } from '@/services/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type UpsertData = { social_id?: string; email?: string; password?: string; name?: string };

type UserState = {
  socialId: string | null;
  loading: boolean;
  setSocialId: (id: string | null) => void;
  loadFromStorage: () => Promise<void>;
  upsert: (data: UpsertData) => Promise<any>;
  login: (data: { email?: string; password?: string }) => Promise<any>;
};

export const useUserStore = create<UserState>((set) => ({
  socialId: null,
  loading: false,
  setSocialId: (id) => set({ socialId: id }),

  loadFromStorage: async () => {
    const id = await AsyncStorage.getItem('social_id');
    if (id) set({ socialId: id });
  },

  upsert: async (data) => {
    set({ loading: true });
    try {
      const res: any = await usersApi.upsert(data);
      // Expect backend to return object with social_id (normalized by our api client)
      const socialId = res?.social_id || res?.data?.social_id || res?.data?.id || res?.id;
      if (socialId) {
        await AsyncStorage.setItem('social_id', socialId);
        set({ socialId });
      }
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  login: async (data) => {
    set({ loading: true });
    try {
      const res: any = await usersApi.login(data);
      const socialId = res?.social_id || res?.data?.social_id || res?.data?.id || res?.id;
      if (socialId) {
        await AsyncStorage.setItem('social_id', socialId);
        set({ socialId });
      }
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
}));
