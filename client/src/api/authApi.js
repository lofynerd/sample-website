import apiClient from './client.js';
import authClient from './authClient.js';

export async function register({ email, password, name, turnstileToken }) {
  const { data } = await apiClient.post('/auth/register', { email, password, name, turnstileToken });
  return data;
}

export async function login({ email, password, turnstileToken }) {
  const { data } = await apiClient.post('/auth/login', { email, password, turnstileToken });
  return data;
}

export async function getMe() {
  const { data } = await authClient.get('/auth/me');
  return data;
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await apiClient.post('/auth/reset-password', { token, password });
  return data;
}

export async function verifyEmail(token) {
  const { data } = await apiClient.get('/auth/verify-email', { params: { token } });
  return data;
}

export async function getMyOrders() {
  const { data } = await authClient.get('/orders/mine');
  return data.results;
}

export async function getMyWishlist() {
  const { data } = await authClient.get('/wishlist');
  return data.productIds;
}

export async function syncWishlist(productIds) {
  const { data } = await authClient.put('/wishlist', { productIds });
  return data.productIds;
}

export async function addToWishlist(productId) {
  const { data } = await authClient.post(`/wishlist/${productId}`);
  return data.productIds;
}

export async function removeFromWishlist(productId) {
  const { data } = await authClient.delete(`/wishlist/${productId}`);
  return data.productIds;
}
