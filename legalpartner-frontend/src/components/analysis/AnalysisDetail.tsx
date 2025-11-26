"use client";
import { useState } from 'react';
import type { ContractAnalysis, ContractClause, FavorabilityLevel } from '@/types';
import { 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Shield
} from 'lucide-react';
import FavorabilityBadge from '@/components/common/FavorabilityBadge';

interface AnalysisDetailProps {
  analysis: ContractAnalysis;
  onClauseClick?: (clause: ContractClause) => void;
}

// function getFavorabilityColor(level?: FavorabilityLevel): string {
//   const colors = {
//     'very_favorable': 'text-green-700 bg-green-100',
//     'favorable': 'text-blue-700 bg-blue-100',
//     'neutral': 'text-gray-700 bg-gray-100',
//     'unfavorable': 'text-yellow-700 bg-yellow-100',
//     'very_unfavorable': 'text-red-700 bg-red-100',
//   };
//   return level ? colors[level] : 'text-gray-700 bg-gray-100';
// }

// function getFavorabilityIcon(level?: FavorabilityLevel) {
//   const icons = {
//     'very_favorable': <TrendingUp className="w-4 h-4" />,
//     'favorable': <TrendingUp className="w-4 h-4" />,
//     'neutral': <Minus className="w-4 h-4" />,
//     'unfavorable': <TrendingDown className="w-4 h-4" />,
//     'very_unfavorable': <TrendingDown className="w-4 h-4" />,
//   };
//   return level ? icons[level] : <Minus className="w-4 h-4" />;
// }

function getFavorabilityLabel(level?: FavorabilityLevel): string {
  const labels = {
    'very_favorable': 'Seguro',
    'favorable': 'Seguro',
    'neutral': 'Atención',
    'unfavorable': 'Crítico',
    'very_unfavorable': 'Crítico',
  };
  return level ? labels[level] : 'N/A';
}

// function getRiskColor(score?: number): string {
//   if (!score) return 'bg-gray-200 text-gray-700';
//   if (score <= 3) return 'bg-green-500 text-white';
//   if (score <= 6) return 'bg-yellow-500 text-white';
//   return 'bg-red-500 text-white';
// }

function getProgressBarColor(value: number, max: number): string {
  const percentage = (value / max) * 100;
  if (percentage <= 30) return 'bg-green-500';
  if (percentage <= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function AnalysisDetail({ analysis, onClauseClick }: AnalysisDetailProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'clauses'>('overview');

  const isCompleted = analysis.analysis_state === 'processed' || analysis.analysis_state === 'completed';
  const isProcessing = analysis.analysis_state === 'processing' || analysis.analysis_state === 'queued';
  const isFailed = analysis.analysis_state === 'failed';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary-100">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {analysis.document_name || 
                 analysis.document_filename || 
                 (typeof analysis.document !== 'string' ? analysis.document.original_filename : 'Análisis de Contrato')}
              </h1>
              <p className="text-sm text-gray-500">
                ID: {analysis.analysis_id}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
            {isProcessing && <Clock className="w-5 h-5 text-yellow-600 animate-spin" />}
            {isFailed && <XCircle className="w-5 h-5 text-red-600" />}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isCompleted ? 'bg-green-100 text-green-700' :
              isProcessing ? 'bg-yellow-100 text-yellow-700' :
              isFailed ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {analysis.analysis_state === 'queued' ? 'En cola' :
               analysis.analysis_state === 'processing' ? 'Procesando' :
               analysis.analysis_state === 'processed' || analysis.analysis_state === 'completed' ? 'Completado' :
               analysis.analysis_state === 'failed' ? 'Fallido' : analysis.analysis_state}
            </span>
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && analysis.progress_percentage !== undefined && (
          <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between mb-2 text-sm text-blue-700">
              <span>{analysis.current_step || 'Procesando análisis...'}</span>
              <span className="font-medium">{analysis.progress_percentage}%</span>
            </div>
            <div className="w-full h-2 bg-blue-200 rounded-full">
              <div
                className="h-full transition-all duration-300 bg-blue-600 rounded-full"
                style={{ width: `${analysis.progress_percentage}%` }}
              />
            </div>
            {analysis.estimated_time_remaining && (
              <p className="mt-2 text-xs text-blue-600">
                Tiempo estimado restante: ~{Math.ceil(analysis.estimated_time_remaining / 60)} min
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {isFailed && analysis.error_message && (
          <div className="p-4 mt-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-medium">Error: {analysis.error_message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Only show details if completed */}
      {isCompleted && (
        <>
          {/* Metrics Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Clauses */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Cláusulas</span>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {analysis.total_clauses || 0}
              </div>
            </div>

            {/* Flagged Clauses */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cláusulas Marcadas</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-600">
                {analysis.flagged_clauses || 0}
              </div>
              {analysis.high_risk_clauses_count !== undefined && (
                <p className="mt-1 text-xs text-red-600">
                  {analysis.high_risk_clauses_count} de alto riesgo
                </p>
              )}
            </div>

            {/* Risk Score */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Puntuación de Riesgo</span>
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold text-gray-900">
                  {analysis.risk_score?.toFixed(1) || 'N/A'}
                </div>
                <span className="mb-1 text-sm text-gray-500">/10</span>
              </div>
              {analysis.risk_score !== undefined && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressBarColor(analysis.risk_score, 10)}`}
                      style={{ width: `${(analysis.risk_score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Favorability */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Favorabilidad</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold text-gray-900">
                  {analysis.average_favorability?.toFixed(1) || 'N/A'}
                </div>
                <span className="mb-1 text-sm text-gray-500">/10</span>
              </div>
              {analysis.average_favorability !== undefined && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full transition-all bg-green-500 rounded-full"
                      style={{ width: `${(analysis.average_favorability / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setSelectedTab('overview')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === 'overview'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Resumen General
                </button>
                <button
                  onClick={() => setSelectedTab('clauses')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === 'clauses'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cláusulas ({analysis.clauses?.length || 0})
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Resumen del Análisis
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {analysis.analysis_summary || 'No hay resumen disponible'}
                    </p>
                  </div>

                  {analysis.general_analysis && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Análisis General
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {analysis.general_analysis}
                      </p>
                    </div>
                  )}

                  {/* AI Model Info */}
                  {analysis.ai_model_info && Object.keys(analysis.ai_model_info).length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">
                        Información del Modelo IA
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
                        {Object.entries(analysis.ai_model_info).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-500 capitalize">{key}:</span>
                            <span className="ml-1 font-medium text-gray-900">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing Time */}
                  {analysis.processing_time_seconds && (
                    <div className="text-sm text-gray-500">
                      Tiempo de procesamiento: {analysis.processing_time_seconds} segundos
                    </div>
                  )}
                </div>
              )}

              {/* Clauses Tab */}
              {selectedTab === 'clauses' && (
                <div className="space-y-3">
                  {!analysis.clauses || analysis.clauses.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                      No hay cláusulas analizadas disponibles
                    </p>
                  ) : (
                    analysis.clauses.map((clause) => (
                      <div
                        key={clause.clause_id}
                        onClick={() => onClauseClick?.(clause)}
                        className="p-4 transition-all border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:border-primary-300"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500">
                              #{clause.clause_order}
                            </span>
                            <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                              {clause.clause_type}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {clause.analysis?.is_high_risk && (
                              <span className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 bg-red-100 rounded">
                                <AlertTriangle className="w-3 h-3" />
                                Alto Riesgo
                              </span>
                            )}
                            {clause.analysis && (
                              <FavorabilityBadge 
                                label={getFavorabilityLabel(clause.analysis.favorability_level)}
                                className="text-xs"
                              />
                            )}
                          </div>
                        </div>

                        <p className="mb-2 text-sm text-gray-700 line-clamp-2">
                          {clause.text_preview || clause.clause_text}
                        </p>

                        {clause.analysis && (
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>
                              Favorabilidad: <strong>{clause.analysis.favorability_rate.toFixed(1)}/10</strong>
                            </span>
                            <span>
                              Confianza: <strong>{(clause.analysis.confidence_score * 100).toFixed(0)}%</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
