import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
  name?: string;
  phone: string;
  role: string;
  cashback: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateCashback: (amount: number) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      updateCashback: (amount) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, cashback: amount } });
        }
      },

      logout: () => set({ user: null, token: null }),

      isAdmin: () => get().user?.role === 'admin',

      isLoggedIn: () => !!get().user,
    }),
    {
      name: 'gorillas-auth',
    }
  )
);
