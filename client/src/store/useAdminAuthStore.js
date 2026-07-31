import { create } from 'zustand';

// Admin session store: persists the JWT to sessionStorage (cleared when the tab closes)
const STORAGE_KEY = 'maison_delulu_admin_token';

function loadToken() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

const useAdminAuthStore = create((set, get) => ({
  token: loadToken(),

  isAuthenticated: () => Boolean(get().token),

  login: (token) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, token);
    } catch {
      // storage unavailable, session will not persist across reload
    }
    set({ token });
  },

  logout: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ token: null });
  },
}));

export default useAdminAuthStore;
