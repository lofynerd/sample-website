import { create } from 'zustand';
import posthog from 'posthog-js';

// Cart store: persists items to localStorage for the slide-out cart drawer
const STORAGE_KEY = 'maison_delulu_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable (private mode, quota) - fail silently
  }
}

const useCartStore = create((set, get) => ({
  items: loadCart(),
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (product, variant, quantity = 1) => {
    const items = [...get().items];
    const existingIndex = items.findIndex(
      (item) => item.productId === product.id && item.variantId === variant?.id
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        variantId: variant?.id ?? null,
        name: product.name,
        price: variant?.price ?? product.price,
        image: variant?.image ?? product.image,
        color: variant?.color ?? null,
        size: variant?.size ?? null,
        quantity,
      });
    }

    posthog.capture('cart_item_added', {
      product_id: product.id,
      product_name: product.name,
      variant_id: variant?.id ?? null,
      variant_color: variant?.color ?? null,
      variant_size: variant?.size ?? null,
      price: variant?.price ?? product.price,
      quantity,
      // group analytics: attribute this event to the collection group, when known
      ...(product.collection ? { $groups: { collection: product.collection } } : {}),
    });
    persist(items);
    set({ items, isOpen: true });
  },

  removeItem: (productId, variantId) => {
    const removed = get().items.find(
      (item) => item.productId === productId && item.variantId === variantId
    );
    const items = get().items.filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );
    posthog.capture('cart_item_removed', {
      product_id: productId,
      product_name: removed?.name ?? null,
      variant_id: variantId,
    });
    persist(items);
    set({ items });
  },

  updateQuantity: (productId, variantId, quantity) => {
    const items = get().items.map((item) =>
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    persist(items);
    set({ items });
  },

  clearCart: () => {
    persist([]);
    set({ items: [] });
  },

  get subtotal() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  get itemCount() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export default useCartStore;
