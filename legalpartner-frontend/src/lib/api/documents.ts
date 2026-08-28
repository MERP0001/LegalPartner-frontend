import type {
  ApiResponse,
  Document,
  DocumentStats,
  DocumentStatus,
  PaginatedResponse,
} from '@/types';
import { apiClient } from './client';

export async function listDocuments(
  params?: Record<string, unknown>
): Promise<PaginatedResponse<Document>> {
  const res = await apiClient.get('/api/documents/', { params });
  return res.data as PaginatedResponse<Document>;
}

export async function uploadDocument(
  file: File,
  contractType?: string,
  metadata?: Record<string, unknown>
): Promise<{
  success: boolean;
  data?: Document;
  is_duplicate?: boolean;
  message?: string;
  error?: string;
}> {
  const form = new FormData();
  form.append('file', file);
  if (contractType) form.append('contract_type', contractType);
  if (metadata) form.append('metadata', JSON.stringify(metadata));
  const res = await apiClient.post('/api/documents/upload/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // La subida de un PDF grande puede superar el timeout global.
    timeout: 0,
  });
  return res.data as {
    success: boolean;
    data?: Document;
    is_duplicate?: boolean;
    message?: string;
    error?: string;
  };
}

export async function getDocument(id: string): Promise<ApiResponse<Document>> {
  const res = await apiClient.get(`/api/documents/${id}/`);
  return res.data as ApiResponse<Document>;
}

/** GET /api/documents/{id}/ocr_status/ — los campos vienen en el nivel raíz, no bajo data. */
export type OcrStatusResponse = {
  success: boolean;
  document_id?: string;
  current_status?: DocumentStatus;
  has_extracted_text?: boolean;
  page_count?: number | null;
  ocr_confidence?: number | null;
  processing_time_seconds?: number | null;
  error?: unknown;
};

export async function getOcrStatus(id: string): Promise<OcrStatusResponse> {
  const res = await apiClient.get(`/api/documents/${id}/ocr_status/`);
  return res.data as OcrStatusResponse;
}

export async function getStats(): Promise<ApiResponse<DocumentStats>> {
  const res = await apiClient.get('/api/documents/stats/');
  return res.data as ApiResponse<DocumentStats>;
}
