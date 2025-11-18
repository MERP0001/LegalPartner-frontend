import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import type { User, ApiResponse, Document, DocumentStats, ContractAnalysis, Consultation, ConsultationResponseData, ConsultationFeedback } from '@/types';

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
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

export async function listDocuments(params?: Record<string, unknown>): Promise<ApiResponse<Document[]>> {
  const res = await apiClient.get('/api/documents/', { params });
  return res.data as ApiResponse<Document[]>;
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

export async function listAnalyses(params?: Record<string, unknown>): Promise<ApiResponse<ContractAnalysis[]>> {
  const res = await apiClient.get('/api/contracts/analysis/', { params });
  return res.data as ApiResponse<ContractAnalysis[]>;
}

export async function getAnalysis(id: string): Promise<ApiResponse<ContractAnalysis>> {
  const res = await apiClient.get(`/api/contracts/analysis/${id}/`);
  return res.data as ApiResponse<ContractAnalysis>;
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

export async function chatbotAsk(question: string, context?: Record<string, unknown>, options?: Record<string, unknown>): Promise<ApiResponse<ConsultationResponseData>> {
  const res = await apiClient.post('/api/consultations/ask/', { question, context, options });
  return res.data as ApiResponse<ConsultationResponseData>;
}

export async function listConsultations(params?: Record<string, unknown>): Promise<ApiResponse<Consultation[]>> {
  const res = await apiClient.get('/api/consultations/', { params });
  return res.data as ApiResponse<Consultation[]>;
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