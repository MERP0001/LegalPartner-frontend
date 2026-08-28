/**
 * Cliente HTTP y funciones de acceso a la API de LegalPartner, agrupadas por dominio.
 * Los consumidores importan siempre desde '@/lib/api'.
 */
export { apiClient as default, apiClient, API_BASE_URL } from './client';
export * from './errors';
export * from './auth';
export * from './documents';
export * from './analysis';
export * from './consultations';
