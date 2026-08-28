import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// En producción next.config.ts exige la variable; el fallback solo aplica en desarrollo.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 30 s por defecto; las llamadas largas (subida, chatbot) lo anulan explícitamente.
  timeout: 30000,
});

apiClient.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Rutas de autenticación: un 401 aquí es una credencial incorrecta, no una sesión caducada.
const AUTH_PATHS = [
  '/api/auth/login/',
  '/api/auth/register/',
  '/api/auth/token/refresh/',
  '/api/auth/verify-email/',
  '/api/auth/resend-verification/',
];

// Una única renovación en vuelo aunque varias peticiones reciban 401 a la vez.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = useAuthStore.getState().refreshToken;
  if (!refresh) return null;
  if (!refreshPromise) {
    // Cliente axios "limpio" para no pasar por los interceptores.
    refreshPromise = axios
      .post<{ access: string; refresh?: string }>(
        `${API_BASE_URL}/api/auth/token/refresh/`,
        { refresh }
      )
      .then(res => {
        const access = res.data.access;
        // ROTATE_REFRESH_TOKENS está activo en el backend: llega un refresh nuevo.
        useAuthStore
          .getState()
          .setTokens({ access, refresh: res.data.refresh ?? refresh });
        return access;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function forceLogout() {
  useAuthStore.getState().logout();
  if (typeof window !== 'undefined') {
    // Fuera del árbol de React no hay router; una recarga completa además limpia estado en memoria.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/auth/login';
  }
}

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isAuthPath = AUTH_PATHS.some(p => originalRequest?.url?.includes(p));
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthPath
    ) {
      originalRequest._retry = true;
      const access = await refreshAccessToken();
      if (access) {
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      }
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
