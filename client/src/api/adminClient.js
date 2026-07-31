import axios from 'axios';
import useAdminAuthStore from '../store/useAdminAuthStore.js';

// Axios instance for admin-only endpoints, attaches the JWT and clears it on 401
const adminClient = axios.create({ baseURL: '/api/v1' });

adminClient.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default adminClient;
