"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnalysisPolling } from "@/hooks/useAnalysisPolling";
import type { ContractClause } from "@/types";
import Protected from "@/components/layout/Protected";
import { ArrowLeft, FileText, Loader2, XCircle, AlertCircle } from "lucide-react";
import FavorabilityBadge from "@/components/common/FavorabilityBadge";
import ClauseDetailModal from "@/components/analysis/ClauseDetailModal";
import { getAnalysisStateLabel, getFavorabilityLabel, isAnalysisCompleted, isAnalysisFailed, isAnalysisInProgress } from "@/lib/labels";

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [selectedClause, setSelectedClause] = useState<ContractClause | null>(null);

  // Carga el análisis y, mientras esté en cola o procesando, lo refresca cada 5 s
  const { analysis: data, loading, error } = useAnalysisPolling({
    analysisId: id || null,
    interval: 5000,
    autoPoll: true,
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Protected />
        <div className="container px-4 py-8 mx-auto">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-4 animate-pulse">
              <div className="w-1/3 h-8 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen">
        <Protected />
        <div className="container px-4 py-8 mx-auto">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 p-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
              <XCircle className="flex-shrink-0 w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <Protected />
        <div className="container px-4 py-8 mx-auto">
          <div className="mx-auto max-w-7xl">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="py-8 text-center text-gray-600">
                <p className="mb-2">Análisis no encontrado</p>
                <p className="text-sm text-gray-500">ID: {id}</p>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analyzedClauses = data.clauses?.filter((c) => c.has_analysis) ?? [];
  const isProcessing = isAnalysisInProgress(data.analysis_state);
  const isCompleted = isAnalysisCompleted(data.analysis_state);
  const isFailed = isAnalysisFailed(data.analysis_state);

  return (
    <div className="min-h-screen bg-gray-50">
      <Protected />
      <div className="h-2 bg-primary-600" />
      
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto space-y-6 max-w-7xl">
          <button
            onClick={() => router.push('/analysis')}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a análisis</span>
          </button>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <FileText className="w-6 h-6 mt-1 text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {data.document_filename || (typeof data.document !== 'string' ? data.document.original_filename : 'Análisis de Contrato')}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">ID: {data.analysis_id.slice(0, 8)}...</p>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCompleted ? 'bg-green-100 text-green-800' :
                  isProcessing ? 'bg-yellow-100 text-yellow-800' :
                  isFailed ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {getAnalysisStateLabel(data.analysis_state)}
                </span>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-start gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin mt-0.5" />
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-blue-900">Análisis en proceso</h3>
                  <p className="mb-3 text-sm text-blue-700">{data.current_step || 'Procesando análisis...'}</p>
                  {data.progress_percentage !== undefined && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">Progreso</span>
                        <span className="font-medium text-blue-900">{data.progress_percentage}%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden bg-blue-200 rounded-full">
                        <div className="h-full transition-all duration-300 bg-blue-600" style={{ width: `${data.progress_percentage}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isFailed && (
            <div className="p-6 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="mb-1 font-semibold text-red-900">El análisis falló</h3>
                  <p className="text-sm text-red-700">{data.error_message || 'Ocurrió un error durante el análisis'}</p>
                </div>
              </div>
            </div>
          )}

          {isCompleted && (
            <>
              <div className="p-4 bg-white border-4 rounded-lg shadow-sm lp-gradient-border">
                <div className="mb-1 text-sm text-gray-600">Total Cláusulas Analizadas</div>
                <div className="text-2xl font-bold text-gray-900">{analyzedClauses.length}</div>
              </div>

              {(data.analysis_summary || data.general_analysis) && (
                <div className="p-6 bg-white border-4 rounded-lg shadow-sm lp-gradient-border">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumen del Análisis</h2>
                  {data.analysis_summary && (
                    <div className="mb-4">
                      <h3 className="mb-2 text-sm font-medium text-gray-700">Resumen</h3>
                      <p className="leading-relaxed text-gray-900">{data.analysis_summary}</p>
                    </div>
                  )}
                  {data.general_analysis && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-700">Análisis General</h3>
                      <p className="leading-relaxed text-gray-900 whitespace-pre-line">{data.general_analysis}</p>
                    </div>
                  )}
                </div>
              )}

              {analyzedClauses.length > 0 && (
                <div className="p-6 bg-white border-4 rounded-lg shadow-sm bg-gradient-to-r from-primary-600 to-danger-500 lp-gradient-border">
                  <div className="p-6 bg-white rounded">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Cláusulas Analizadas ({analyzedClauses.length})</h2>
                  <div className="space-y-4">
                    {analyzedClauses.map((clause, index) => (
                      <div 
                        key={clause.clause_id} 
                        className={`p-4 transition-all duration-300 ease-in-out border-2 rounded-lg cursor-pointer transform hover:scale-105 hover:shadow-xl ${
                          index % 2 === 0 
                            ? 'border-primary-600 hover:border-primary-700 hover:bg-primary-50' 
                            : 'border-danger-500 hover:border-danger-600 hover:bg-red-50'
                        }`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Ver detalle de la cláusula ${index + 1}`}
                        onClick={() => setSelectedClause(clause)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">Cláusula {index + 1}</span>
                          </div>
                          {clause.analysis && (
                            <FavorabilityBadge 
                              label={getFavorabilityLabel(clause.analysis.favorability_level)}
                              className=""
                            />
                          )}
                        </div>
                        <p className="mb-3 text-sm text-gray-700 line-clamp-2">{clause.text_preview || clause.clause_text}</p>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              )}

              {analyzedClauses.length === 0 && (
                <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="mb-1 font-semibold text-blue-900">Sin cláusulas analizadas</h3>
                      <p className="text-sm text-blue-700">El análisis se completó pero no se encontraron cláusulas con análisis en el documento.</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedClause && (
        <ClauseDetailModal
          clause={selectedClause}
          index={analyzedClauses.findIndex((c) => c.clause_id === selectedClause.clause_id)}
          onClose={() => setSelectedClause(null)}
        />
      )}
    </div>
  );
}
