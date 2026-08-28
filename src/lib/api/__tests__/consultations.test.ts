import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  apiClient: { post: vi.fn(), get: vi.fn() },
}));

import { apiClient } from '../client';
import { askChatbotAndWait } from '../consultations';

const post = vi.mocked(apiClient.post);
const get = vi.mocked(apiClient.get);

const queued = {
  data: {
    success: true,
    data: { status: 'processing', question_id: 'q1', chat_id: 'c1' },
  },
};

describe('askChatbotAndWait', () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
  });

  it('envía la pregunta, sondea hasta completed y devuelve la respuesta', async () => {
    post.mockResolvedValue(queued);
    get
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: { status: 'processing', question_id: 'q1', chat_id: 'c1' },
        },
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            status: 'completed',
            response: 'Hola',
            chat_id: 'c1',
            sources: [],
          },
        },
      });

    const result = await askChatbotAndWait('¿Puedo rescindir?', {
      chatId: 'c1',
      intervalMs: 1,
    });

    expect(post).toHaveBeenCalledWith('/api/consultations/ask/', {
      question: '¿Puedo rescindir?',
      context: { chat_id: 'c1' },
      options: undefined,
    });
    expect(get).toHaveBeenCalledTimes(2);
    expect(get).toHaveBeenCalledWith('/api/consultations/status/q1/');
    expect(result.response).toBe('Hola');
  });

  it('lanza el error del backend cuando el estado es failed', async () => {
    post.mockResolvedValue(queued);
    get.mockResolvedValueOnce({
      data: {
        success: true,
        data: { status: 'failed', error: 'Modelo no disponible' },
      },
    });
    await expect(
      askChatbotAndWait('¿Puedo rescindir?', { intervalMs: 1 })
    ).rejects.toThrow('Modelo no disponible');
  });

  it('lanza un error si el POST no devuelve question_id', async () => {
    post.mockResolvedValue({ data: { success: false, message: 'Sin cuota' } });
    await expect(askChatbotAndWait('¿Puedo rescindir?')).rejects.toThrow(
      'Sin cuota'
    );
  });

  it('abandona al superar el tiempo máximo', async () => {
    post.mockResolvedValue(queued);
    get.mockResolvedValue({
      data: {
        success: true,
        data: { status: 'processing', question_id: 'q1', chat_id: 'c1' },
      },
    });
    await expect(
      askChatbotAndWait('¿Puedo rescindir?', { intervalMs: 1, timeoutMs: 5 })
    ).rejects.toThrow(/tardando demasiado/);
  });
});
