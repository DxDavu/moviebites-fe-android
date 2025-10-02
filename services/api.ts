import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const DEFAULT_BASE_URL = 'https://moviebites-api.rishi-300.workers.dev';

const expoExtra =
  (Constants.expoConfig && Constants.expoConfig.extra) ||
  (Constants.manifest && Constants.manifest.extra) ||
  {};
const BASE_URL =
  expoExtra.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;
const MOBILE_API_KEY =
  expoExtra.EXPO_PUBLIC_MOBILE_API_KEY || process.env.EXPO_PUBLIC_MOBILE_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure headers/params objects exist on config
api.interceptors.request.use(async (config) => {
  try {
    config.headers = config.headers || {};
    config.params = config.params || {};

    // Add mobile API key if available (kept as header)
    if (MOBILE_API_KEY) {
      config.headers['X-API-KEY'] = MOBILE_API_KEY;
    }

    // Prefer social_id if user logged in, otherwise send a device udid (guest)
    const socialId = await AsyncStorage.getItem('social_id');
    if (socialId) {
      // Add as query param for backend compatibility
      config.params['social_id'] = socialId;
    } else {
      // Try to reuse an existing udid or create one
      let udid = await AsyncStorage.getItem('udid');
      if (!udid) {
        udid = `udid_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
        await AsyncStorage.setItem('udid', udid);
      }
      config.params['udid'] = udid;
    }

    // Debug: log outgoing requests to help diagnose 404s during development
    try {
      // Avoid logging very large bodies in production; this is dev-only debug info
      // eslint-disable-next-line no-console
      console.debug('API Request:', {
        method: config.method,
        url: `${config.baseURL}${config.url}`,
        params: config.params,
        data: config.data,
      });
    } catch (e) {
      // ignore logging errors
    }

    return config;
  } catch (e) {
    // If anything goes wrong building headers/params, still return config so request can proceed
    return config;
  }
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    const method = error?.config?.method;

    const normalized =
      error && error.response && error.response.data
        ? error.response.data
        : { message: error.message || 'Unknown API error' };

    console.error('API Error:', { status, method, url, normalized });
    return Promise.reject(normalized);
  }
);

export default api;