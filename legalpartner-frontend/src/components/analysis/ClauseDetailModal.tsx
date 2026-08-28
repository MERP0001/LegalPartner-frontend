'use client';
import { useEffect, useState } from 'react';
import type { ContractClause } from '@/types';
import { XCircle } from 'lucide-react';
import FavorabilityBadge from '@/components/common/FavorabilityBadge';
import { favorabilityDefinitions } from '@/lib/favorabilityDefinitions';

interface ClauseDetailModalProps {
  clause: ContractClause;
  /** Posición (base 0) entre las cláusulas analizadas, para el título */
  index: number;
  onClose: () => void;
}

const RELEVANCE_LABELS: Record<string, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};
const getRelevanceLabel = (relevance: string) =>
  RELEVANCE_LABELS[relevance] || relevance;

/** Detalle de una cláusula analizada con acceso a la guía de favorabilidad. */
export default function ClauseDetailModal({
  clause,
  index,
  onClose,
}: ClauseDetailModalProps) {
  const [showFavorabilityGuide, setShowFavorabilityGuide] = useState(false);

  // Cerrar con Escape (primero la guía si está abierta) y bloquear el scroll de fondo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setShowFavorabilityGuide(open => {
        if (!open) onClose();
        return false;
      });
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border-4 lp-gradient-border'
        onClick={e => e.stopPropagation()}
      >
        <div className='sticky top-0 flex items-center justify-between gap-3 p-6 bg-white border-b border-gray-200'>
          <h3
            id='clause-modal-title'
            className='flex-1 text-lg font-semibold text-gray-900'
          >
            Detalle de Cláusula {index + 1}
          </h3>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowFavorabilityGuide(true)}
              className='px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200'
            >
              Guía
            </button>
            <button
              onClick={onClose}
              className='text-gray-400 transition-colors hover:text-gray-600'
              aria-label='Cerrar modal cláusula'
            >
              <XCircle className='w-6 h-6' />
            </button>
          </div>
        </div>
        <div className='p-6 space-y-6'>
          <div>
            <h4 className='mb-2 text-sm font-medium text-gray-700'>
              Texto de la Cláusula
            </h4>
            <div className='p-4 text-gray-900 whitespace-pre-line border-2 rounded-lg bg-gray-50 lp-gradient-border'>
              {clause.clause_text}
            </div>
          </div>

          {clause.analysis && (
            <>
              <div>
                <h4 className='mb-2 text-sm font-medium text-gray-700'>
                  Análisis
                </h4>
                <p className='text-gray-900'>{clause.analysis.outcome}</p>
              </div>

              {/* Divider */}
              <div className='relative py-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent'></div>
                </div>
                <div className='relative flex justify-center'>
                  <span className='px-6 py-1 text-xs font-semibold tracking-wider text-yellow-700 uppercase bg-white border border-yellow-200 rounded-full shadow-sm'>
                    Evaluación
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {clause.analysis.risk_factors &&
                  clause.analysis.risk_factors.length > 0 && (
                    <div>
                      <h4 className='mb-2 text-sm font-medium text-gray-700'>
                        Factores de Riesgo
                      </h4>
                      <ul className='space-y-2'>
                        {clause.analysis.risk_factors.map((risk, idx) => (
                          <li key={idx} className='flex items-start gap-2'>
                            <span className='mt-1 text-red-500'>•</span>
                            <span className='text-gray-900'>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {clause.analysis.recommendations &&
                  clause.analysis.recommendations.length > 0 && (
                    <div>
                      <h4 className='mb-2 text-sm font-medium text-gray-700'>
                        Recomendaciones
                      </h4>
                      <ul className='space-y-2'>
                        {clause.analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className='flex items-start gap-2'>
                            <span className='mt-1 text-blue-500'>•</span>
                            <span className='text-gray-900'>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Divider */}
              {clause.analysis.related_articles &&
                clause.analysis.related_articles.length > 0 && (
                  <div className='relative py-6'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent'></div>
                    </div>
                    <div className='relative flex justify-center'>
                      <span className='px-6 py-1 text-xs font-semibold tracking-wider text-purple-600 uppercase bg-white border border-purple-200 rounded-full shadow-sm'>
                        Referencias Legales
                      </span>
                    </div>
                  </div>
                )}

              {clause.analysis.related_articles &&
                clause.analysis.related_articles.length > 0 && (
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-gray-700'>
                      Artículos Legales Relacionados
                    </h4>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      {clause.analysis.related_articles.map((article, idx) => (
                        <div key={idx} className='p-3 rounded-lg bg-gray-50'>
                          <div className='font-medium text-gray-900'>
                            {article.law_name}
                          </div>
                          <div className='text-sm text-gray-600'>
                            {article.article_reference}
                          </div>
                          {article.content && (
                            <p className='mt-2 text-sm text-gray-700'>
                              {article.content}
                            </p>
                          )}
                          <div className='mt-1 text-xs text-gray-500'>
                            Relevancia: {getRelevanceLabel(article.relevance)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
      {showFavorabilityGuide && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40'
          onClick={() => setShowFavorabilityGuide(false)}
        >
          <div
            className='w-full max-w-sm bg-white border-4 rounded-lg shadow-lg lp-gradient-border'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center justify-between px-4 py-3 border-b'>
              <h4 className='text-sm font-semibold text-gray-800'>
                Guía Favorabilidad
              </h4>
              <button
                onClick={() => setShowFavorabilityGuide(false)}
                className='p-1 rounded hover:bg-gray-100'
                aria-label='Cerrar guía'
              >
                <XCircle className='w-4 h-4 text-gray-500' />
              </button>
            </div>
            <div className='p-4 space-y-3 text-sm'>
              {Object.entries(favorabilityDefinitions).map(([label, def]) => (
                <div key={label} className='flex items-start gap-2'>
                  <FavorabilityBadge label={label} />
                  <p className='leading-relaxed text-gray-700'>{def}</p>
                </div>
              ))}
              <div className='p-2 mt-2 text-xs text-blue-700 border border-blue-200 rounded bg-blue-50'>
                Usa la favorabilidad para priorizar revisión: Seguro (sin
                acción), Atención (verificar), Crítico (intervenir).
              </div>
            </div>
            <div className='px-4 py-3 border-t bg-gray-50'>
              <button
                onClick={() => setShowFavorabilityGuide(false)}
                className='w-full px-3 py-2 text-sm font-semibold text-white rounded bg-primary-600 hover:bg-primary-700'
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
