import { create } from 'zustand';
import posthog from 'posthog-js';
import useAuthStore from './useAuthStore.js';
import { addToWishlist, removeFromWishlist, syncWishlist, getMyWishlist } from '../api/authApi.js';

// Wishlist store: persists saved product ids to localStorage, and syncs to the
// backend whenever a customer is signed in so the wishlist follows them across devices.
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

    // Best-effort sync to the account when signed in; local state is already updated
    if (useAuthStore.getState().token) {
      const request = exists ? removeFromWishlist(product.id) : addToWishlist(product.id);
      request.catch(() => {
        // ignore transient sync failures, local storage remains the source of truth for this session
      });
    }
  },

  // Merges the local (guest) wishlist into the account's existing wishlist right after login
  syncAfterLogin: async () => {
    try {
      const remoteIds = await getMyWishlist();
      const merged = [...new Set([...remoteIds, ...get().productIds])];
      const saved = await syncWishlist(merged);
      persist(saved);
      set({ productIds: saved });
    } catch {
      // ignore, local wishlist remains usable
    }
  },
}));

export default useWishlistStore;
