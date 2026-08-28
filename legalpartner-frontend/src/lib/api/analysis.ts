import type {
  AnalysisListResponse,
  ApiResponse,
  ContractAnalysis,
} from '@/types';
import { apiClient } from './client';

export type StartAnalysisResponse = {
  success: boolean;
  data?: { analysis_id: string; task_id?: string };
  message?: string;
  error?: string;
};

export async function startAnalysis(
  documentId: string,
  contractType?: string
): Promise<StartAnalysisResponse> {
  const payload: Record<string, unknown> = { document_id: documentId };
  if (contractType) payload.contract_type = contractType;
  const res = await apiClient.post('/api/contracts/analyze/', payload);
  return res.data as StartAnalysisResponse;
}

/** GET /api/contracts/analysis/progress/{task_id}/ (estado de la tarea Celery) */
export type AnalysisProgressData = {
  task_id: string;
  state: 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE' | string;
  stage: string;
  progress: number;
  description: string;
  total_steps?: number;
  current_step?: number;
  result?: {
    analysis_id?: string;
    total_clauses?: number;
    flagged_clauses?: number;
    overall_favorability?: string;
    risk_score?: number;
    processing_time_seconds?: number;
  };
};

export async function getAnalysisProgress(
  taskId: string
): Promise<ApiResponse<AnalysisProgressData>> {
  const res = await apiClient.get(
    `/api/contracts/analysis/progress/${taskId}/`
  );
  return res.data as ApiResponse<AnalysisProgressData>;
}

export async function listAnalyses(
  params?: Record<string, unknown>
): Promise<AnalysisListResponse> {
  const res = await apiClient.get('/api/contracts/analysis/', { params });
  return res.data as AnalysisListResponse;
}

export async function getAnalysis(
  id: string
): Promise<ApiResponse<ContractAnalysis>> {
  const res = await apiClient.get(`/api/contracts/analysis/${id}/`);
  return res.data as ApiResponse<ContractAnalysis>;
}

// Devuelve data undefined cuando el documento aún no tiene análisis (404) o falla la petición.
export type LatestAnalysisResponse = {
  success: boolean;
  data?: ContractAnalysis;
};

export async function getLatestDocumentAnalysis(
  documentId: string
): Promise<LatestAnalysisResponse> {
  try {
    const res = await apiClient.get(
      `/api/contracts/analysis/document/${documentId}/latest/`
    );
    return res.data as LatestAnalysisResponse;
  } catch (error: unknown) {
    // Si no hay análisis (404) o cualquier otro error, devolvemos success: false
    // Esto no es un error crítico, simplemente no hay análisis disponible
    if (
      (error as { response?: { status?: number } })?.response?.status === 404
    ) {
      return { success: false };
    }
    // Para otros errores, también devolvemos success: false
    return { success: false };
  }
}
