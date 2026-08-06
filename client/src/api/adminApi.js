import adminClient from './adminClient.js';

export async function login(username, password) {
  const { data } = await adminClient.post('/admin/login', { username, password });
  return data.token;
}

export async function createProduct(product) {
  const { data } = await adminClient.post('/products', product);
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await adminClient.patch(`/products/id/${id}`, product);
  return data;
}

export async function deleteProduct(id) {
  await adminClient.delete(`/products/id/${id}`);
}

export async function createArticle(article) {
  const { data } = await adminClient.post('/journal', article);
  return data;
}

export async function updateArticle(id, article) {
  const { data } = await adminClient.patch(`/journal/id/${id}`, article);
  return data;
}

export async function deleteArticle(id) {
  await adminClient.delete(`/journal/id/${id}`);
}

export async function getOrders(params = {}) {
  const { data } = await adminClient.get('/orders', { params });
  return data;
}

export async function getOrder(id) {
  const { data } = await adminClient.get(`/orders/id/${id}`);
  return data;
}

export async function updateOrderStatus(id, status, note) {
  const { data } = await adminClient.patch(`/orders/id/${id}/status`, { status, note });
  return data;
}

export async function getAuditLog(params = {}) {
  const { data } = await adminClient.get('/audit-log', { params });
  return data;
}

export async function getSubscribers(params = {}) {
  const { data } = await adminClient.get('/subscribers', { params });
  return data;
}

export async function getContactMessages(params = {}) {
  const { data } = await adminClient.get('/contact', { params });
  return data;
}

export async function getBusinessAnalytics() {
  const { data } = await adminClient.get('/analytics/business');
  return data;
}

export async function getPosthogAnalytics() {
  const { data } = await adminClient.get('/analytics/posthog');
  return data;
}
