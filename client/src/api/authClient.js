import axios from 'axios';
import useAuthStore from '../store/useAuthStore.js';

// Axios instance for customer-authenticated endpoints, attaches the JWT and clears it on 401
const authClient = axios.create({ baseURL: '/api/v1' });

authClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default authClient;
