"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAnalysis } from "@/lib/api";
import { getApiErrorMessage, getErrorMessage } from "@/lib/apiError";
import type { ContractAnalysis, ContractClause } from "@/types";
import Protected from "@/components/layout/Protected";
import { ArrowLeft, FileText, Loader2, XCircle, AlertCircle } from "lucide-react";
import FavorabilityBadge from "@/components/common/FavorabilityBadge";
import { favorabilityDefinitions } from "@/lib/favorabilityDefinitions";

function getFavorabilityClass(level: string) {
  const classes = {
    'very_favorable': 'bg-green-100 text-green-800 border-green-200',
    'favorable': 'bg-blue-100 text-blue-800 border-blue-200',
    'neutral': 'bg-gray-100 text-gray-800 border-gray-200',
    'unfavorable': 'bg-orange-100 text-orange-800 border-orange-200',
    'very_unfavorable': 'bg-red-100 text-red-800 border-red-200'
  };
  return classes[level as keyof typeof classes] || 'bg-gray-100 text-gray-800';
}

function getFavorabilityLabel(level: string): string {
  const labels: Record<string, string> = {
    'very_favorable': 'Seguro',
    'favorable': 'Seguro',
    'neutral': 'Atención',
    'unfavorable': 'Crítico',
    'very_unfavorable': 'Crítico',
  };
  return labels[level] || level;
}

function getRiskScoreClass(score: number) {
  if (score <= 3) return 'text-green-600';
  if (score <= 6) return 'text-orange-600';
  return 'text-red-600';
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [data, setData] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClause, setSelectedClause] = useState<ContractClause | null>(null);
  const [showFavorabilityGuide, setShowFavorabilityGuide] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalysis(id);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(getErrorMessage(res, 'No se pudo cargar el análisis'));
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'Error al cargar el análisis'));
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

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

  const isProcessing = data.analysis_state === 'processing' || data.analysis_state === 'queued';
  const isCompleted = data.analysis_state === 'processed' || data.analysis_state === 'completed';
  const isFailed = data.analysis_state === 'failed';

  return (
    <div className="min-h-screen bg-gray-50">
      <Protected />
      <div className="h-2 bg-primary-600" />
      
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto space-y-6 max-w-7xl">
          <button
            onClick={() => window.location.href = '/analysis'}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a análisis</span>
          </button>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
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
                  {data.analysis_state === 'queued' ? 'En cola' :
                   data.analysis_state === 'processing' ? 'Procesando' :
                   data.analysis_state === 'processed' || data.analysis_state === 'completed' ? 'Completado' :
                   data.analysis_state === 'failed' ? 'Fallido' : data.analysis_state}
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
              <div className="p-4 bg-white border-4 rounded-lg shadow-sm" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
                <div className="mb-1 text-sm text-gray-600">Total Cláusulas Analizadas</div>
                <div className="text-2xl font-bold text-gray-900">{data.clauses?.filter(c => c.has_analysis).length || 0}</div>
              </div>
              {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="mb-1 text-sm text-gray-600">Cláusulas Marcadas</div>
                  <div className="text-2xl font-bold text-orange-600">{data.flagged_clauses || 0}</div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="mb-1 text-sm text-gray-600">Favorabilidad</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {data.average_favorability ? `${data.average_favorability.toFixed(1)}/10` : 'N/A'}
                  </div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="mb-1 text-sm text-gray-600">Riesgo</div>
                  <div className={`text-2xl font-bold ${data.risk_score ? getRiskScoreClass(data.risk_score) : 'text-gray-900'}`}>
                    {data.risk_score ? `${data.risk_score.toFixed(1)}/10` : 'N/A'}
                  </div>
                </div>
              </div> */}

              {(data.analysis_summary || data.general_analysis) && (
                <div className="p-6 bg-white border-4 rounded-lg shadow-sm" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
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

              {data.clauses && data.clauses.filter(c => c.has_analysis).length > 0 && (
                <div className="p-6 bg-white border-4 rounded-lg shadow-sm bg-gradient-to-r from-primary-600 to-danger-500" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
                  <div className="p-6 bg-white rounded">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Cláusulas Analizadas ({data.clauses.filter(c => c.has_analysis).length})</h2>
                  <div className="space-y-4">
                    {data.clauses.filter(c => c.has_analysis).map((clause, index) => (
                      <div 
                        key={clause.clause_id} 
                        className={`p-4 transition-all duration-300 ease-in-out border-2 rounded-lg cursor-pointer transform hover:scale-105 hover:shadow-xl ${
                          index % 2 === 0 
                            ? 'border-primary-600 hover:border-primary-700 hover:bg-primary-50' 
                            : 'border-danger-500 hover:border-danger-600 hover:bg-red-50'
                        }`}
                        onClick={() => setSelectedClause(clause)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">Cláusula {index + 1}</span>
                            {/* <span className="ml-2 text-sm text-gray-500">• {clause.clause_type}</span> */}
                          </div>
                          {clause.analysis && (
                            <FavorabilityBadge 
                              label={getFavorabilityLabel(clause.analysis.favorability_level)}
                              className=""
                            />
                          )}
                        </div>
                        <p className="mb-3 text-sm text-gray-700 line-clamp-2">{clause.text_preview || clause.clause_text}</p>
                        {clause.analysis && (
                          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                            {/* <div>
                              <div className="text-xs text-gray-500">Favorabilidad</div>
                              <div className="text-sm font-medium text-gray-900">{clause.analysis.favorability_rate?.toFixed(1) ?? 'N/A'}/10</div>
                            </div> */}
                            {/* <div>
                              <div className="text-xs text-gray-500">Confianza</div>
                              <div className="text-sm font-medium text-gray-900">{clause.analysis.confidence_score ? (clause.analysis.confidence_score * 100).toFixed(0) : 'N/A'}%</div>
                            </div> */}
                            {/* <div>
                              <div className="text-xs text-gray-500">Riesgo</div>
                              <div className="text-sm font-medium text-gray-900">{clause.analysis.is_high_risk ? 'Alto' : 'Normal'}</div>
                            </div> */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              )}

              {(!data.clauses || data.clauses.filter(c => c.has_analysis).length === 0) && (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setSelectedClause(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border-4" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between gap-3 p-6 bg-white border-b border-gray-200">
              <h3 className="flex-1 text-lg font-semibold text-gray-900">Detalle de Cláusula {(data.clauses?.filter(c => c.has_analysis).findIndex(c => c.clause_id === selectedClause.clause_id) ?? -1) + 1}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFavorabilityGuide(true)}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200"
                >Guía</button>
                <button onClick={() => setSelectedClause(null)} className="text-gray-400 transition-colors hover:text-gray-600" aria-label="Cerrar modal cláusula">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Texto de la Cláusula</h4>
                <div className="p-4 text-gray-900 whitespace-pre-line border-2 rounded-lg bg-gray-50" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>{selectedClause.clause_text}</div>
              </div>

              {selectedClause.analysis && (
                <>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Análisis</h4>
                    <p className="text-gray-900">{selectedClause.analysis.outcome}</p>
                  </div>

                  {/* <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border-2 rounded-lg bg-gray-50" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
                      <div className="mb-1 text-sm text-gray-600">Favorabilidad</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedClause.analysis.favorability_rate?.toFixed(1) ?? 'N/A'}/10</div>
                      <div className={`text-xs mt-1 px-2 py-1 rounded ${getFavorabilityClass(selectedClause.analysis.favorability_level)}`}>
                        {selectedClause.analysis.favorability_level === 'very_favorable' ? 'Muy Favorable' :
                         selectedClause.analysis.favorability_level === 'favorable' ? 'Favorable' :
                         selectedClause.analysis.favorability_level === 'neutral' ? 'Neutral' :
                         selectedClause.analysis.favorability_level === 'unfavorable' ? 'Desfavorable' :
                         selectedClause.analysis.favorability_level === 'very_unfavorable' ? 'Muy Desfavorable' :
                         selectedClause.analysis.favorability_level}
                      </div>
                    </div>
                    <div className="p-4 border-2 rounded-lg bg-gray-50" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
                      <div className="mb-1 text-sm text-gray-600">Confianza</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedClause.analysis.confidence_score ? (selectedClause.analysis.confidence_score * 100).toFixed(0) : 'N/A'}%</div>
                    </div>
                    <div className="p-4 border-2 rounded-lg bg-gray-50" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
                      <div className="mb-1 text-sm text-gray-600">Riesgo</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedClause.analysis.is_high_risk ? 'Alto' : 'Normal'}</div>
                    </div>
                  </div> */}

                  {/* Divider */}
                  <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-6 py-1 text-xs font-semibold tracking-wider text-yellow-700 uppercase bg-white border border-yellow-200 rounded-full shadow-sm">
                        Evaluación
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {selectedClause.analysis.risk_factors && selectedClause.analysis.risk_factors.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">Factores de Riesgo</h4>
                        <ul className="space-y-2">
                          {selectedClause.analysis.risk_factors.map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1 text-red-500">•</span>
                              <span className="text-gray-900">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedClause.analysis.recommendations && selectedClause.analysis.recommendations.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">Recomendaciones</h4>
                        <ul className="space-y-2">
                          {selectedClause.analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1 text-blue-500">•</span>
                              <span className="text-gray-900">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  {selectedClause.analysis.related_articles && selectedClause.analysis.related_articles.length > 0 && (
                    <div className="relative py-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-6 py-1 text-xs font-semibold tracking-wider text-purple-600 uppercase bg-white border border-purple-200 rounded-full shadow-sm">
                          Referencias Legales
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedClause.analysis.related_articles && selectedClause.analysis.related_articles.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Artículos Legales Relacionados</h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {selectedClause.analysis.related_articles.map((article, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-gray-50">
                            <div className="font-medium text-gray-900">{article.law_name}</div>
                            <div className="text-sm text-gray-600">{article.article_reference}</div>
                            {article.content && (
                              <p className="mt-2 text-sm text-gray-700">{article.content}</p>
                            )}
                            <div className="mt-1 text-xs text-gray-500">Relevancia: {article.relevance === 'high' ? 'Alta' : article.relevance === 'medium' ? 'Media' : article.relevance === 'low' ? 'Baja' : article.relevance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* {selectedClause.analysis.legal_precedents && selectedClause.analysis.legal_precedents.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Precedentes Legales</h4>
                      <div className="space-y-3">
                        {selectedClause.analysis.legal_precedents.map((precedent, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-gray-50">
                            <div className="font-medium text-gray-900">{precedent.case}</div>
                            <div className="mt-1 text-sm text-gray-600">Relevancia: {precedent.relevance === 'high' ? 'Alta' : precedent.relevance === 'medium' ? 'Media' : precedent.relevance === 'low' ? 'Baja' : precedent.relevance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </>
              )}
            </div>
          </div>
          {showFavorabilityGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowFavorabilityGuide(false)}>
              <div className="w-full max-w-sm bg-white border-4 rounded-lg shadow-lg" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h4 className="text-sm font-semibold text-gray-800">Guía Favorabilidad</h4>
                  <button onClick={() => setShowFavorabilityGuide(false)} className="p-1 rounded hover:bg-gray-100" aria-label="Cerrar guía">
                    <XCircle className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  {Object.entries(favorabilityDefinitions).map(([label, def]) => (
                    <div key={label} className="flex items-start gap-2">
                      <FavorabilityBadge label={label} />
                      <p className="leading-relaxed text-gray-700">{def}</p>
                    </div>
                  ))}
                  <div className="p-2 mt-2 text-xs text-blue-700 border border-blue-200 rounded bg-blue-50">
                    Usa la favorabilidad para priorizar revisión: Seguro (sin acción), Atención (verificar), Crítico (intervenir).
                  </div>
                </div>
                <div className="px-4 py-3 border-t bg-gray-50">
                  <button onClick={() => setShowFavorabilityGuide(false)} className="w-full px-3 py-2 text-sm font-semibold text-white rounded bg-primary-600 hover:bg-primary-700">Cerrar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
