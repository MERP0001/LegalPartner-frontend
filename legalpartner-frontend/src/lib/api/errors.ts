import axios from 'axios';

/**
 * Forma de los errores del backend. El exception handler unifica en
 * {success:false, error}, pero accounts/ usa message/errors y el chatbot
 * puede devolver error como objeto {code, message, details}.
 */
export interface ApiErrorPayload {
  success?: boolean;
  error?: unknown;
  errors?: unknown;
  message?: unknown;
  detail?: unknown;
  requires_verification?: boolean;
  email?: string;
}

function flatten(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(flatten).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    return Object.entries(obj)
      .map(([field, val]) => {
        const text = flatten(val);
        if (!text) return '';
        return field === 'non_field_errors' ? text : `${field}: ${text}`;
      })
      .filter(Boolean)
      .join(' ');
  }
  return String(value);
}

/** Mensaje legible a partir del cuerpo de una respuesta (con éxito o no). */
export function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const p = payload as ApiErrorPayload;
  return flatten(p.error) || flatten(p.errors) || flatten(p.message) || flatten(p.detail) || fallback;
}

/** Cuerpo JSON de la respuesta de error de axios, si existe. */
export function getApiErrorData(err: unknown): ApiErrorPayload | null {
  if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
    return err.response.data as ApiErrorPayload;
  }
  return null;
}

/** Mensaje legible a partir de una excepción lanzada por axios. */
export function getApiErrorMessage(err: unknown, fallback = 'Error de servidor'): string {
  if (axios.isAxiosError(err)) {
    if (err.code === 'ECONNABORTED') return 'La petición tardó demasiado. Inténtalo de nuevo.';
    if (!err.response) return 'No se pudo conectar con el servidor.';
    const fromBody = getErrorMessage(err.response.data, '');
    if (fromBody) return fromBody;
    switch (err.response.status) {
      case 401:
        return 'Tu sesión ha expirado. Inicia sesión de nuevo.';
      case 403:
        return 'No tienes permiso para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 429:
        return 'Demasiadas peticiones. Espera un momento.';
      default:
        return fallback;
    }
  }
  return fallback;
}
