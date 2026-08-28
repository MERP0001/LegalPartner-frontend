import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types';

export interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens, user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        login: (tokens, user) =>
          set({
            token: tokens.access,
            refreshToken: tokens.refresh,
            user,
            isAuthenticated: true,
            isLoading: false,
          }),
        // Usado por el interceptor al renovar el access token (el backend rota el refresh).
        setTokens: (tokens) =>
          set({ token: tokens.access, refreshToken: tokens.refresh }),
        logout: () =>
          set({
            token: null,
            refreshToken: null,
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
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
