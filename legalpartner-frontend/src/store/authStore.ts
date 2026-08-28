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
  /** true cuando el estado persistido ya se leyó de localStorage (solo en cliente) */
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (tokens: AuthTokens, user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        hasHydrated: false,
        setHasHydrated: value => set({ hasHydrated: value }),
        login: (tokens, user) =>
          set({
            token: tokens.access,
            refreshToken: tokens.refresh,
            user,
            isAuthenticated: true,
          }),
        // Usado por el interceptor al renovar el access token (el backend rota el refresh).
        setTokens: tokens =>
          set({ token: tokens.access, refreshToken: tokens.refresh }),
        logout: () =>
          set({
            token: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: 'auth-storage',
        // El primer render en cliente coincide con el del servidor (sin sesión);
        // los componentes esperan a hasHydrated antes de mostrar estado de sesión.
        onRehydrateStorage: () => state => state?.setHasHydrated(true),
        partialize: state => ({
          token: state.token,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
