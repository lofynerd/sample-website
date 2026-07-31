import { create } from 'zustand';
import posthog from 'posthog-js';

// Wishlist store: persists saved product ids to localStorage
const STORAGE_KEY = 'maison_delulu_wishlist_v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage unavailable, fail silently
  }
}

const useWishlistStore = create((set, get) => ({
  productIds: load(),

  isWishlisted: (productId) => get().productIds.includes(productId),

  toggle: (product) => {
    const exists = get().productIds.includes(product.id);
    const productIds = exists
      ? get().productIds.filter((id) => id !== product.id)
      : [...get().productIds, product.id];

    posthog.capture(exists ? 'wishlist_item_removed' : 'wishlist_item_added', {
      product_id: product.id,
      product_name: product.name,
    });

    persist(productIds);
    set({ productIds });
  },
}));

export default useWishlistStore;
