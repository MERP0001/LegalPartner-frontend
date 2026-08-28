"use client";
import { useEffect, useRef, useState } from 'react';
import type { ContractClause, FavorabilityLevel } from '@/types';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Lightbulb,
  Scale,
  FileText,
  Info
} from 'lucide-react';
import FavorabilityBadge from '@/components/common/FavorabilityBadge';
import { favorabilityDefinitions } from '@/lib/favorabilityDefinitions';

interface ClauseDetailModalProps {
  clause: ContractClause | null;
  isOpen: boolean;
  onClose: () => void;
}

function getFavorabilityColor(level?: FavorabilityLevel): string {
  const colors = {
    'very_favorable': 'text-green-700 bg-green-100',
    'favorable': 'text-blue-700 bg-blue-100',
    'neutral': 'text-gray-700 bg-gray-100',
    'unfavorable': 'text-yellow-700 bg-yellow-100',
    'very_unfavorable': 'text-red-700 bg-red-100',
  };
  return level ? colors[level] : 'text-gray-700 bg-gray-100';
}

function getFavorabilityIcon(level?: FavorabilityLevel) {
  const icons = {
    'very_favorable': <TrendingUp className="w-5 h-5" />,
    'favorable': <TrendingUp className="w-5 h-5" />,
    'neutral': <Minus className="w-5 h-5" />,
    'unfavorable': <TrendingDown className="w-5 h-5" />,
    'very_unfavorable': <TrendingDown className="w-5 h-5" />,
  };
  return level ? icons[level] : <Minus className="w-5 h-5" />;
}

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

export default function ClauseDetailModal({ clause, isOpen, onClose }: ClauseDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showFavorabilityGuide, setShowFavorabilityGuide] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !clause) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col lp-gradient-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Cláusula #{clause.clause_order}
              </h2>
              <p className="text-sm text-gray-500">{clause.clause_type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Clause Text */}
          <div>
            <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4" />
              Texto de la Cláusula
            </h3>
            <div className="p-4 border-2 rounded-lg bg-gray-50 lp-gradient-border">
              <p className="leading-relaxed text-gray-800 whitespace-pre-wrap">
                {clause.clause_text}
              </p>
            </div>
            {clause.page_number && (
              <p className="mt-2 text-xs text-gray-500">
                Página {clause.page_number}
              </p>
            )}
          </div>

          {/* Divider */}
          {clause.analysis && (
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 py-1 text-xs font-semibold tracking-wider uppercase bg-white border rounded-full shadow-sm text-primary-600 border-primary-200">
                  Análisis Detallado
                </span>
              </div>
            </div>
          )}

          {/* Analysis Section */}
          {clause.analysis && (
            <>
              {/* Outcome */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Análisis
                </h3>
                <div className="p-4 border-2 rounded-lg bg-blue-50 lp-gradient-border">
                  <p className="leading-relaxed text-gray-800">
                    {clause.analysis.outcome}
                  </p>
                </div>
              </div>

              {/* Favorability (Badge + Guide) */}
              <div className="p-4 bg-white border-2 rounded-lg lp-gradient-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <TrendingUp className="w-4 h-4 text-primary-600" /> Favorabilidad
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFavorabilityGuide(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      aria-haspopup="dialog"
                      aria-controls="favorability-guide"
                    >
                      <Info className="w-3 h-3" /> Guía
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${getFavorabilityColor(clause.analysis.favorability_level)}`}>{getFavorabilityIcon(clause.analysis.favorability_level)}</div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Puntaje</span>
                    <span className="text-xl font-bold text-gray-900">
                      {clause.analysis.favorability_rate.toFixed(1)}<span className="text-sm text-gray-500">/10</span>
                    </span>
                  </div>
                  <div className="ml-auto">
                    <FavorabilityBadge label={getFavorabilityLabel(clause.analysis.favorability_level)} />
                  </div>
                </div>
              </div>

              {/* Metrics */}
              {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2"> */}
                {/* Favorability */}
                {/* <div className="p-4 bg-white border-2 rounded-lg lp-gradient-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Favorabilidad</span>
                    <div className={`p-1.5 rounded ${getFavorabilityColor(clause.analysis.favorability_level)}`}>
                      {getFavorabilityIcon(clause.analysis.favorability_level)}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {clause.analysis.favorability_rate.toFixed(1)}
                    <span className="text-sm text-gray-500">/10</span>
                  </div>
                  <div className="mt-2">
                    <FavorabilityBadge 
                      label={getFavorabilityLabel(clause.analysis.favorability_level)}
                      className=""
                    />
                  </div>
                </div> */}

                {/* Risk */}
                {/* <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Riesgo</span>
                    <AlertTriangle className={`h-5 w-5 ${clause.analysis.is_high_risk ? 'text-red-600' : 'text-green-600'}`} />
                  </div>
                  <div className={`text-2xl font-bold ${clause.analysis.is_high_risk ? 'text-red-600' : 'text-green-600'}`}>
                    {clause.analysis.is_high_risk ? 'Alto' : 'Bajo'}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {clause.analysis.is_high_risk ? 'Requiere atención' : 'Aceptable'}
                  </p>
                </div> */}

                {/* Confidence */}
                {/* <div className="p-4 bg-white border-2 rounded-lg lp-gradient-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Confianza IA</span>
                    <div className="p-1.5 bg-purple-100 rounded">
                      <Scale className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(clause.analysis.confidence_score * 100).toFixed(0)}%
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${clause.analysis.confidence_score * 100}%` }}
                      />
                    </div>
                  </div>
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

              {/* Risk Factors and Recommendations in parallel */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Risk Factors */}
                {clause.analysis.risk_factors && clause.analysis.risk_factors.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      Factores de Riesgo
                    </h3>
                    <ul className="space-y-2">
                      {clause.analysis.risk_factors.map((risk, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-3 border border-yellow-200 rounded-lg bg-yellow-50"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {clause.analysis.recommendations && clause.analysis.recommendations.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      Recomendaciones
                    </h3>
                    <ul className="space-y-2">
                      {clause.analysis.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Divider */}
              {clause.analysis.related_articles && clause.analysis.related_articles.length > 0 && (
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

              {/* Legal Articles */}
              {clause.analysis.related_articles && clause.analysis.related_articles.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                    <Scale className="w-4 h-4 text-purple-600" />
                    Artículos Legales Relacionados
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clause.analysis.related_articles.map((article, index) => (
                      <div
                        key={index}
                        className="p-4 border border-purple-200 rounded-lg bg-purple-50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {article.law_name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {article.article_reference}
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs text-purple-700 capitalize bg-purple-200 rounded">
                            {article.relevance === 'high' ? 'Alta' : 
                             article.relevance === 'medium' ? 'Media' : 
                             article.relevance === 'low' ? 'Baja' : article.relevance}
                          </span>
                        </div>
                        {article.content && (
                          <p className="mt-2 text-sm text-gray-700">
                            {article.content}
                          </p>
                        )}
                        {!article.content && article.excerpt && (
                          <p className="mt-2 text-sm italic text-gray-700">
                            &ldquo;{article.excerpt}&rdquo;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Precedents */}
              {/* {clause.analysis.legal_precedents && clause.analysis.legal_precedents.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                    <Scale className="w-4 h-4 text-indigo-600" />
                    Precedentes Legales
                  </h3>
                  <div className="space-y-3">
                    {clause.analysis.legal_precedents.map((precedent, index) => (
                      <div
                        key={index}
                        className="p-4 border border-indigo-200 rounded-lg bg-indigo-50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {precedent.case}
                          </h4>
                          <span className="px-2 py-1 text-xs text-indigo-700 capitalize bg-indigo-200 rounded">
                            {precedent.relevance === 'high' ? 'Alta' : 
                             precedent.relevance === 'medium' ? 'Media' : 
                             precedent.relevance === 'low' ? 'Baja' : precedent.relevance}
                          </span>
                        </div>
                        {precedent.excerpt && (
                          <p className="mt-2 text-sm italic text-gray-700">
                            "{precedent.excerpt}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </>
          )}

          {!clause.analysis && (
            <div className="py-8 text-center text-gray-500">
              <p>No hay análisis disponible para esta cláusula</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Nested Favorability Guide Modal */}
      {showFavorabilityGuide && (
        <div
          id="favorability-guide"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
        >
          <div className="w-full max-w-md bg-white border-2 shadow-lg rounded-xl lp-gradient-border">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-sm font-semibold text-gray-800">Guía de Favorabilidad</h3>
              <button
                onClick={() => setShowFavorabilityGuide(false)}
                className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
                aria-label="Cerrar guía de favorabilidad"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              {Object.entries(favorabilityDefinitions).map(([label, definition]) => (
                <div key={label} className="flex items-start gap-3">
                  <FavorabilityBadge label={label} />
                  <p className="leading-relaxed text-gray-700">{definition}</p>
                </div>
              ))}
              <div className="p-3 mt-2 text-xs text-blue-700 border border-blue-200 rounded-lg bg-blue-50">
                Estos niveles simplificados ayudan a priorizar revisión: Seguro (sin acción inmediata), Atención (verificar matices), Crítico (intervención recomendada).
              </div>
            </div>
            <div className="px-5 py-3 border-t bg-gray-50">
              <button
                onClick={() => setShowFavorabilityGuide(false)}
                className="w-full px-4 py-2 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
