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
  // 30 s por defecto; las llamadas largas (subida, chatbot) lo anulan explícitamente.
  timeout: 30000,
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
  errors?: unknown;
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

export async function apiVerifyEmail(key: string): Promise<{ success: boolean; message?: string; email?: string }> {
  const res = await apiClient.post('/api/auth/verify-email/', { key });
  return res.data;
}

export async function apiResendVerification(email: string): Promise<{ success: boolean; message?: string }> {
  const res = await apiClient.post('/api/auth/resend-verification/', { email });
  return res.data;
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
    // La subida de un PDF grande puede superar el timeout global.
    timeout: 0,
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
  return res.data as ApiResponse<ContractAnalysis>;
}

// Devuelve data undefined cuando el documento aún no tiene análisis (404) o falla la petición.
export type LatestAnalysisResponse = { success: boolean; data?: ContractAnalysis };

export async function getLatestDocumentAnalysis(documentId: string): Promise<LatestAnalysisResponse> {
  try {
    const res = await apiClient.get(`/api/contracts/analysis/document/${documentId}/latest/`);
    return res.data as LatestAnalysisResponse;
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

/** Respuesta 202 de POST /api/consultations/ask/: la pregunta queda encolada. */
export type ChatbotQueuedData = {
  status: 'processing';
  question_id: string;
  chat_id?: string;
  status_url?: string;
};

/** GET /api/consultations/status/{question_id}/ */
export type ChatbotStatusData =
  | { status: 'processing'; question_id: string; chat_id: string }
  | (ConsultationResponseData & { status: 'completed' | 'failed'; chat_id?: string; error?: string | null });

export type ChatbotAskOptions = {
  /** chat_id para continuar el mismo hilo de conversación */
  chatId?: string;
  context?: Record<string, unknown>;
  options?: Record<string, unknown>;
  /** Intervalo de sondeo (1-2 s según la referencia del backend) */
  intervalMs?: number;
  /** Tiempo máximo de espera antes de abandonar */
  timeoutMs?: number;
  signal?: AbortSignal;
};

export async function chatbotAsk(
  question: string,
  context?: Record<string, unknown>,
  options?: Record<string, unknown>
): Promise<ApiResponse<ChatbotQueuedData>> {
  const res = await apiClient.post('/api/consultations/ask/', { question, context, options });
  return res.data as ApiResponse<ChatbotQueuedData>;
}

export async function getConsultationStatus(questionId: string): Promise<ApiResponse<ChatbotStatusData>> {
  const res = await apiClient.get(`/api/consultations/status/${questionId}/`);
  return res.data as ApiResponse<ChatbotStatusData>;
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

/**
 * Envía la pregunta y sondea el estado hasta obtener la respuesta.
 * Lanza Error con un mensaje legible si la consulta falla o expira.
 */
export async function askChatbotAndWait(
  question: string,
  { chatId, context, options, intervalMs = 1500, timeoutMs = 5 * 60 * 1000, signal }: ChatbotAskOptions = {}
): Promise<ConsultationResponseData & { chat_id?: string }> {
  const ctx = { ...(context ?? {}), ...(chatId ? { chat_id: chatId } : {}) };
  const queued = await chatbotAsk(question, ctx, options);
  if (!queued.success || !queued.data?.question_id) {
    throw new Error(typeof queued.message === 'string' ? queued.message : 'No se pudo enviar la consulta');
  }

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(intervalMs, signal);
    const res = await getConsultationStatus(queued.data.question_id);
    if (!res.success) {
      throw new Error(typeof res.message === 'string' ? res.message : 'No se pudo consultar el estado');
    }
    const data = res.data;
    if (data.status === 'processing') continue;
    if (data.status === 'failed') {
      throw new Error(data.error || data.response || 'Error al procesar la consulta');
    }
    return data;
  }
  throw new Error('La consulta está tardando demasiado. Inténtalo de nuevo más tarde.');
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