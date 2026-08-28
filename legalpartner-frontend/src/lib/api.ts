import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import type { 
  User, 
  ApiResponse, 
  Document, 
  DocumentStats, 
  ContractAnalysis, 
  Consultation, 
  ConsultationResponseData, 
  ConsultationFeedback,
  AnalysisListResponse,
  PaginatedResponse
} from '@/types';

// En producción next.config.ts exige la variable; el fallback solo aplica en desarrollo.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Rutas de autenticación: un 401 aquí es una credencial incorrecta, no una sesión caducada.
const AUTH_PATHS = [
  '/api/auth/login/',
  '/api/auth/register/',
  '/api/auth/token/refresh/',
  '/api/auth/verify-email/',
];

// Una única renovación en vuelo aunque varias peticiones reciban 401 a la vez.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = useAuthStore.getState().refreshToken;
  if (!refresh) return null;
  if (!refreshPromise) {
    // Cliente axios "limpio" para no pasar por los interceptores.
    refreshPromise = axios
      .post<{ access: string; refresh?: string }>(`${API_BASE_URL}/api/auth/token/refresh/`, { refresh })
      .then((res) => {
        const access = res.data.access;
        // ROTATE_REFRESH_TOKENS está activo en el backend: llega un refresh nuevo.
        useAuthStore.getState().setTokens({ access, refresh: res.data.refresh ?? refresh });
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
    window.location.href = '/auth/login';
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthPath = AUTH_PATHS.some((p) => originalRequest?.url?.includes(p));
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthPath) {
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

export type LoginResponse = {
  success: boolean;
  message?: string;
  requires_verification?: boolean;
  email?: string;
  tokens?: { refresh: string; access: string };
  user?: User;
};

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await apiClient.post('/api/auth/login/', { email, password });
  return res.data;
}

export type RegisterResponse = {
  success: boolean;
  message?: string;
  requires_verification?: boolean;
  user?: User;
  tokens?: { refresh: string; access: string };
  errors?: Record<string, unknown> | string;
};

export async function apiRegister(data: {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  organization?: string;
}): Promise<RegisterResponse> {
  const res = await apiClient.post('/api/auth/register/', data);
  return res.data as RegisterResponse;
}

export async function listDocuments(params?: Record<string, unknown>): Promise<PaginatedResponse<Document>> {
  const res = await apiClient.get('/api/documents/', { params });
  return res.data as PaginatedResponse<Document>;
}

export async function uploadDocument(
  file: File,
  contractType?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; data?: Document; is_duplicate?: boolean; message?: string; error?: string }> {
  const form = new FormData();
  form.append('file', file);
  if (contractType) form.append('contract_type', contractType);
  if (metadata) form.append('metadata', JSON.stringify(metadata));
  const res = await apiClient.post('/api/documents/upload/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as { success: boolean; data?: Document; is_duplicate?: boolean; message?: string; error?: string };
}

export async function getDocument(id: string): Promise<ApiResponse<Document>> {
  const res = await apiClient.get(`/api/documents/${id}/`);
  return res.data as ApiResponse<Document>;
}

export function getDocumentDownloadUrl(id: string): string {
  return `${API_BASE_URL}/api/documents/${id}/download/`;
}

export type StartAnalysisResponse = {
  success: boolean;
  data?: { analysis_id: string; task_id?: string };
  message?: string;
  error?: string;
};

export async function startAnalysis(documentId: string, contractType?: string): Promise<StartAnalysisResponse> {
  const payload: Record<string, unknown> = { document_id: documentId };
  if (contractType) payload.contract_type = contractType;
  const res = await apiClient.post('/api/contracts/analyze/', payload);
  return res.data as StartAnalysisResponse;
}

export async function getStats(): Promise<ApiResponse<DocumentStats>> {
  const res = await apiClient.get('/api/documents/stats/');
  return res.data as ApiResponse<DocumentStats>;
}

export async function listAnalyses(params?: Record<string, unknown>): Promise<AnalysisListResponse> {
  const res = await apiClient.get('/api/contracts/analysis/', { params });
  return res.data as AnalysisListResponse;
}

export async function getAnalysis(id: string): Promise<ApiResponse<ContractAnalysis>> {
  const res = await apiClient.get(`/api/contracts/analysis/${id}/`);
  const responseData = res.data;
  
  // Si la respuesta ya tiene la estructura {success, data}, la devolvemos tal cual
  if (responseData.success !== undefined && responseData.data !== undefined) {
    return responseData as ApiResponse<ContractAnalysis>;
  }
  
  // Si la respuesta es directamente el objeto de análisis, lo envolvemos
  return {
    success: true,
    data: responseData as ContractAnalysis,
  } as ApiResponse<ContractAnalysis>;
}

// Devuelve data undefined cuando el documento aún no tiene análisis (404) o falla la petición.
export type LatestAnalysisResponse = { success: boolean; data?: ContractAnalysis };

export async function getLatestDocumentAnalysis(documentId: string): Promise<LatestAnalysisResponse> {
  try {
    const res = await apiClient.get(`/api/contracts/analysis/document/${documentId}/latest/`);
    const responseData = res.data;
    
    // Si la respuesta ya tiene la estructura {success, data}, la devolvemos tal cual
    if (responseData.success !== undefined && responseData.data !== undefined) {
      return responseData as ApiResponse<ContractAnalysis>;
    }
    
    // Si la respuesta es directamente el objeto de análisis, lo envolvemos
    return {
      success: true,
      data: responseData as ContractAnalysis,
    } as ApiResponse<ContractAnalysis>;
  } catch (error: unknown) {
    // Si no hay análisis (404) o cualquier otro error, devolvemos success: false
    // Esto no es un error crítico, simplemente no hay análisis disponible
    if ((error as { response?: { status?: number } })?.response?.status === 404) {
      return { success: false };
    }
    // Para otros errores, también devolvemos success: false
    return { success: false };
  }
}

export type ReanalyzeResponse = {
  success: boolean;
  data?: { analysis_id: string; task_id?: string };
  message?: string;
  error?: string;
};

export async function reanalyzeAnalysis(id: string): Promise<ReanalyzeResponse> {
  const res = await apiClient.post(`/api/contracts/analysis/${id}/reanalyze/`);
  return res.data as ReanalyzeResponse;
}

export async function chatbotAsk(
  question: string,
  context?: Record<string, unknown>,
  options?: Record<string, unknown>
): Promise<ApiResponse<ConsultationResponseData>> {
  // Esta llamada puede tardar más de lo normal (procesamiento/LLM).
  // El cliente axios global tiene timeout=10000ms; aquí anulamos el timeout
  // para que la petición no sea cancelada por el cliente. timeout=0 significa
  // sin límite en axios.
  const res = await apiClient.post('/api/consultations/ask/', { question, context, options }, { timeout: 0 });
  return res.data as ApiResponse<ConsultationResponseData>;
}

export async function listConsultations(params?: Record<string, unknown>): Promise<PaginatedResponse<Consultation>> {
  const res = await apiClient.get('/api/consultations/', { params });
  return res.data as PaginatedResponse<Consultation>;
}

export async function getConsultation(id: string): Promise<ApiResponse<Consultation>> {
  const res = await apiClient.get(`/api/consultations/${id}/`);
  return res.data as ApiResponse<Consultation>;
}

export async function sendConsultationFeedback(id: string, feedback: ConsultationFeedback): Promise<{ success: boolean; message?: string }> {
  const res = await apiClient.post(`/api/consultations/${id}/feedback/`, feedback);
  return res.data as { success: boolean; message?: string };
}

export default apiClient;