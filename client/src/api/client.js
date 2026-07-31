import axios from 'axios';

// Shared axios instance for calls to the Express API, proxied via Vite in dev
const apiClient = axios.create({ baseURL: '/api/v1' });

export default apiClient;
