"use client";
import { useMemo } from 'react';
import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import type { ContractAnalysis } from '@/types';

interface AnalysisProgressBarProps {
  analysis: ContractAnalysis | null;
  isPolling: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const PROGRESS_STAGES = {
  queued: { progress: 10, label: 'En cola', description: 'Análisis en espera de procesamiento' },
  processing: { progress: 50, label: 'Analizando', description: 'Procesando cláusulas con IA' },
  processed: { progress: 90, label: 'Finalizando', description: 'Generando resultados' },
  completed: { progress: 100, label: 'Completado', description: 'Análisis finalizado exitosamente' },
  failed: { progress: 0, label: 'Error', description: 'El análisis falló' },
};

const getProgressBarClasses = (progress: number, isFailed: boolean, isCompleted: boolean, isProcessing: boolean) => {
  let widthClass = 'w-1/12';
  
  if (progress <= 10) widthClass = 'w-[10%]';
  else if (progress <= 25) widthClass = 'w-1/4';
  else if (progress <= 50) widthClass = 'w-1/2';
  else if (progress <= 75) widthClass = 'w-3/4';
  else widthClass = 'w-full';

  return `h-full rounded-full transition-all duration-500 ${
    isFailed
      ? 'bg-red-500'
      : isCompleted
      ? 'bg-green-500'
      : 'bg-gradient-to-r from-blue-500 to-blue-600'
  } ${isProcessing ? 'animate-pulse' : ''} ${widthClass}`;
};

export default function AnalysisProgressBar({
  analysis,
  isPolling,
  error,
  onRetry,
}: AnalysisProgressBarProps) {
  const progressData = useMemo(() => {
    if (!analysis) return null;
    return PROGRESS_STAGES[analysis.analysis_state as keyof typeof PROGRESS_STAGES] || PROGRESS_STAGES.queued;
  }, [analysis]);

  if (!analysis) {
    return null;
  }

  const isFailed = analysis.analysis_state === 'failed' || !!error;
  const isCompleted = analysis.analysis_state === 'completed' || analysis.analysis_state === 'processed';
  const isProcessing = isPolling && !isCompleted && !isFailed;
  
  // Usar progreso del endpoint de progreso si está disponible, sino usar el del stage
  const progressPercentage = analysis.progress_percentage ?? progressData?.progress ?? 0;
  
  // Usar descripción del endpoint de progreso si está disponible, sino usar la del stage
  const displayDescription = analysis.current_step ?? progressData?.description;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar Container */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {progressData?.label}
          </h3>
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">En progreso</span>
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Completado</span>
            </div>
          )}
          {isFailed && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Error</span>
            </div>
          )}
        </div>

        {/* Description */}
        {displayDescription && (
          <p className="text-sm text-gray-600">
            {displayDescription}
          </p>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Progreso</span>
            <span className="text-xs font-semibold text-gray-800">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={getProgressBarClasses(progressPercentage, isFailed, isCompleted, isProcessing)}
            />
          </div>
        </div>

        {/* Analysis Details */}
        {analysis && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Total de cláusulas</p>
              <p className="text-lg font-semibold text-gray-800">
                {analysis.total_clauses || 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Cláusulas problemáticas</p>
              <p className="text-lg font-semibold text-red-600">
                {analysis.flagged_clauses || 0}
              </p>
            </div>

            {analysis.overall_favorability && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Favorabilidad</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold capitalize text-gray-800">
                    {analysis.overall_favorability.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )}

            {analysis.risk_score !== undefined && (
              <div className="flex-1">
                <p className="text-xs text-gray-600">Puntuación de riesgo</p>
                <p className="text-lg font-semibold text-orange-600">
                  {analysis.risk_score !== undefined && analysis.risk_score !== null ? analysis.risk_score.toFixed(1) : 'N/A'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Detalles del endpoint de progreso */}
        {analysis.current_step && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t text-xs">
            {analysis.current_step && (
              <div>
                <p className="text-gray-600">Paso actual</p>
                <p className="font-semibold text-gray-800">{analysis.current_step}</p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {(error || analysis.error_message) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {error || analysis.error_message}
            </p>
          </div>
        )}

        {/* Results Summary */}
        {isCompleted && analysis && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">¡Análisis Completado!</h4>
            </div>
            <div className="text-sm text-green-800 space-y-1">
              {analysis.processing_time_seconds && (
                <p>
                  ⏱️ Tiempo de procesamiento:{' '}
                  <strong>{Math.round(analysis.processing_time_seconds)}s</strong>
                </p>
              )}
              {analysis.analysis_summary && (
                <p className="mt-2">
                  <strong>Resumen:</strong> {analysis.analysis_summary.substring(0, 150)}...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Retry Button */}
        {isFailed && onRetry && (
          <button
            onClick={onRetry}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Reintentar
          </button>
        )}

        {/* Info */}
        {analysis.analysis_id && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ID: {analysis.analysis_id.substring(0, 8)}...
          </div>
        )}
      </div>
    </div>
  );
}
