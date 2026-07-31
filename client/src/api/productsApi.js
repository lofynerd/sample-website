import apiClient from './client.js';

// Normalizes a Mongo product document into the shape components expect (id = slug)
function normalize(doc) {
  return { ...doc, id: doc.slug };
}

export async function getProducts(params = {}) {
  const { data } = await apiClient.get('/products', { params });
  return data.results.map(normalize);
}

export async function getProductBySlug(slug) {
  const { data } = await apiClient.get(`/products/${slug}`);
  return normalize(data);
}

export async function getRelatedProducts(product, limit = 4) {
  const pool = await getProducts({ collection: product.collection, limit: limit + 1 });
  return pool.filter((p) => p.slug !== product.slug).slice(0, limit);
}
