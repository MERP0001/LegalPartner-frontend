import type { AnalysisState, ContractType, FavorabilityLevel } from '@/types';

/** Etiquetas en español de los tipos de contrato (valores de ContractType en el backend). */
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  rent: 'Arrendamiento',
  mortgage: 'Hipoteca',
  services: 'Servicios',
  employment: 'Empleo',
  transfers: 'Transferencias',
};

export const CONTRACT_TYPE_OPTIONS = (Object.keys(CONTRACT_TYPE_LABELS) as ContractType[]).map((value) => ({
  value,
  label: CONTRACT_TYPE_LABELS[value],
}));

export function getContractTypeLabel(type?: string | null, fallback = 'General'): string {
  return (type && CONTRACT_TYPE_LABELS[type as ContractType]) || fallback;
}

/** Etiquetas de los estados de análisis (AnalysisState del backend). */
export const ANALYSIS_STATE_LABELS: Record<AnalysisState, string> = {
  queued: 'En cola',
  processing: 'Procesando',
  processed: 'Completado',
  failed: 'Fallido',
};

export function getAnalysisStateLabel(state?: string | null): string {
  return (state && ANALYSIS_STATE_LABELS[state as AnalysisState]) || state || '';
}

export const isAnalysisCompleted = (state?: string | null) => state === 'processed';
export const isAnalysisInProgress = (state?: string | null) => state === 'queued' || state === 'processing';
export const isAnalysisFailed = (state?: string | null) => state === 'failed';

/**
 * Nivel simplificado de favorabilidad que se muestra al usuario
 * (ver favorabilityDefinitions para la descripción de cada uno).
 */
export type FavorabilityLabel = 'Seguro' | 'Atención' | 'Crítico';

const FAVORABILITY_LABELS: Record<FavorabilityLevel, FavorabilityLabel> = {
  very_favorable: 'Seguro',
  favorable: 'Seguro',
  neutral: 'Atención',
  unfavorable: 'Crítico',
  very_unfavorable: 'Crítico',
};

export function getFavorabilityLabel(level?: string | null): string {
  return (level && FAVORABILITY_LABELS[level as FavorabilityLevel]) || level || 'N/A';
}
