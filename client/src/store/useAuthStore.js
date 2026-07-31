import { create } from 'zustand';

// Customer session store: persists the JWT + user profile to localStorage
const STORAGE_KEY = 'maison_delulu_auth_v1';

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

function persist(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // storage unavailable, session will not persist across reload
  }
}

const useAuthStore = create((set) => ({
  ...loadSession(),

  login: (token, user) => {
    persist({ token, user });
    set({ token, user });
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
