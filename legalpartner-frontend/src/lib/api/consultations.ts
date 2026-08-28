import type { ApiResponse, ConsultationResponseData } from '@/types';
import { apiClient } from './client';

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

