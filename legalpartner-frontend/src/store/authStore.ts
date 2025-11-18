import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: (token: string, user: User) =>
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          }),
        logout: () =>
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);