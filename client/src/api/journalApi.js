import apiClient from './client.js';

export async function getArticles(params = {}) {
  const { data } = await apiClient.get('/journal', { params });
  return data.results;
}

export async function getArticleBySlug(slug) {
  const { data } = await apiClient.get(`/journal/${slug}`);
  return data;
}
