import { useCallback, useEffect, useRef, useState } from 'react';
import { askChatbotAndWait, getApiErrorMessage } from '@/lib/api';
import type { ConsultationResponseData } from '@/types';

export type ChatMsg = {
  role: 'user' | 'assistant';
  content: string;
  meta?: Partial<ConsultationResponseData>;
  /** Respuesta provisional mientras el backend procesa la pregunta */
  pending?: boolean;
};

/** Longitud mínima que valida ConsultationAskSerializer en el backend. */
export const CHATBOT_MIN_QUESTION_LENGTH = 10;

/**
 * Conversación con el chatbot legal: envía la pregunta (202), sondea el
 * estado hasta obtener la respuesta y mantiene el chat_id para que las
 * preguntas siguientes continúen el mismo hilo.
 */
export function useChatbot() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatIdRef = useRef<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  // Cancelar el sondeo si el componente se desmonta a mitad de una consulta
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (q.length < CHATBOT_MIN_QUESTION_LENGTH) {
        setError(
          `La pregunta debe tener al menos ${CHATBOT_MIN_QUESTION_LENGTH} caracteres`
        );
        return;
      }
      if (loading) return;
      setError(null);
      setInput('');
      setLoading(true);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: q },
        { role: 'assistant', content: 'Escribiendo…', pending: true },
      ]);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const data = await askChatbotAndWait(q, {
          chatId: chatIdRef.current,
          signal: controller.signal,
        });
        if (data.chat_id) chatIdRef.current = data.chat_id;
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: data.response, meta: data },
        ]);
      } catch (err) {
        if (controller.signal.aborted) return;
        const msg =
          err instanceof Error && !('isAxiosError' in err)
            ? err.message
            : getApiErrorMessage(err, 'Error al contactar el chatbot');
        setError(msg);
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: 'No pude procesar la consulta.' },
        ]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [loading]
  );

  return { messages, input, setInput, loading, error, send };
}
