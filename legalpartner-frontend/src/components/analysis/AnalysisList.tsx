"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { listAnalyses } from '@/lib/api';
import { getApiErrorMessage, getErrorMessage } from '@/lib/apiError';
import type { ContractAnalysis, AnalysisState, ContractType } from '@/types';
import { Filter, ChevronLeft, ChevronRight, FileText, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface AnalysisListProps {
  onAnalysisClick?: (analysisId: string) => void;
}

function getStatusBadgeClass(status: AnalysisState): string {
  const classes = {
    'queued': 'bg-gray-100 text-gray-700',
    'processing': 'bg-yellow-100 text-yellow-700',
    'processed': 'bg-green-100 text-green-700',
    'completed': 'bg-green-100 text-green-700',
    'failed': 'bg-red-100 text-red-700',
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
}

function getStatusIcon(status: AnalysisState) {
  const icons = {
    'queued': <Clock className="w-4 h-4" />,
    'processing': <Clock className="w-4 h-4 animate-spin" />,
    'processed': <CheckCircle className="w-4 h-4" />,
    'completed': <CheckCircle className="w-4 h-4" />,
    'failed': <XCircle className="w-4 h-4" />,
  };
  return icons[status] || <Clock className="w-4 h-4" />;
}

function getRiskBadgeClass(score?: number): string {
  if (!score) return 'bg-gray-100 text-gray-700';
  if (score <= 3) return 'bg-green-100 text-green-700';
  if (score <= 6) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AnalysisList({ onAnalysisClick }: AnalysisListProps) {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<ContractAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<AnalysisState | ''>('');
  const [typeFilter, setTypeFilter] = useState<ContractType | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const pageSize = 10;

  const loadAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, unknown> = {
        page: currentPage,
        page_size: pageSize,
      };

      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.contract_type = typeFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await listAnalyses(params);

      if (res.success && res.data) {
        setAnalyses(res.data || []);
        setTotalCount(res.pagination?.total_count || 0);
        setHasNext(res.pagination?.has_next || false);
        setHasPrevious(res.pagination?.has_previous || false);
      } else {
        setAnalyses([]);
        setTotalCount(0);
        setHasNext(false);
        setHasPrevious(false);
        setError(getErrorMessage(res, 'No se pudieron cargar los análisis'));
      }
    } catch (err) {
      setAnalyses([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
      setError(getApiErrorMessage(err, 'Error al conectar con el servidor'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, typeFilter, searchTerm]);

  useEffect(() => {
    loadAnalyses();
  }, [currentPage, statusFilter, typeFilter, loadAnalyses]);

  // Debounced search
  useEffect(() => {
    if (!searchTerm) return;
    
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAnalysisClick = (analysisId: string) => {
    if (onAnalysisClick) {
      onAnalysisClick(analysisId);
    } else {
      router.push(`/analysis/${analysisId}`);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="p-4 bg-white border-4 rounded-xl shadow-sm" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block mb-1 text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block mb-1 text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as AnalysisState | '');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los estados</option>
              <option value="queued">En cola</option>
              <option value="processing">Procesando</option>
              <option value="processed">Completado</option>
              <option value="completed">Completado</option>
              <option value="failed">Fallido</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block mb-1 text-sm font-medium text-gray-700">
              Tipo de contrato
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as ContractType | '');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los tipos</option>
              <option value="rent">Arrendamiento</option>
              <option value="mortgage">Hipoteca</option>
              <option value="services">Servicios</option>
              <option value="employment">Empleo</option>
              <option value="transfers">Transferencias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="text-sm text-gray-600">
          Mostrando {analyses.length} de {totalCount} análisis
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/2 h-3 bg-gray-200 rounded" />
                </div>
                <div className="w-24 h-6 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && analyses.length === 0 && (
        <div className="p-8 text-center bg-white border border-gray-200 rounded-lg">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="mb-1 text-lg font-semibold text-gray-900">
            No hay análisis
          </h3>
          <p className="text-sm text-gray-600">
            {statusFilter || typeFilter || searchTerm
              ? 'No se encontraron análisis con los filtros aplicados'
              : 'Comienza subiendo y analizando tu primer contrato'}
          </p>
        </div>
      )}

      {/* Analysis List */}
      {!loading && !error && analyses.length > 0 && (
        <div className="space-y-3">
          {analyses.map((analysis, index) => (
            <div
              key={analysis.analysis_id}
              onClick={() => handleAnalysisClick(analysis.analysis_id)}
              className={`p-4 transition-all duration-300 ease-in-out border-2 rounded-lg cursor-pointer transform hover:scale-105 hover:shadow-xl group ${
                index % 2 === 0 
                  ? 'border-primary-600 hover:border-primary-700 hover:bg-primary-50' 
                  : 'border-danger-500 hover:border-danger-600 hover:bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Side - Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="flex-shrink-0 w-5 h-5 text-primary-600" />
                    <h4 className="font-semibold text-gray-900 truncate transition-colors group-hover:text-primary-600">
                      {analysis.document_name || 
                       analysis.document_filename || 
                       (typeof analysis.document !== 'string' ? analysis.document.original_filename : 'Documento')}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-gray-500">Cláusulas:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {analysis.total_clauses || 0}
                      </span>
                    </div>
                    <div>
                      {/* <span className="text-gray-500">Marcadas:</span>
                      <span className="ml-1 font-medium text-yellow-600">
                        {analysis.flagged_clauses || 0}
                      </span> */}
                    </div>
                    {analysis.risk_score !== undefined && analysis.risk_score !== null && (
                      <div>
                        {/* <span className="text-gray-500">Riesgo:</span> */}
                        {/* <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${getRiskBadgeClass(analysis.risk_score)}`}>
                          {analysis.risk_score.toFixed(1)}/10
                        </span> */}
                      </div>
                    )}
                    {analysis.average_favorability !== undefined && analysis.average_favorability !== null && (
                      <div>
                        <span className="text-gray-500">Favorabilidad:</span>
                        <span className="ml-1 font-medium text-green-600">
                          {analysis.average_favorability.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    {formatDate(analysis.created_at)}
                    {analysis.completed_at && (
                      <span className="ml-2">
                        • Completado: {formatDate(analysis.completed_at)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side - Status */}
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusBadgeClass(analysis.analysis_state)}`}>
                    {getStatusIcon(analysis.analysis_state)}
                    <span className="capitalize">
                      {analysis.analysis_state === 'queued' ? 'En cola' :
                       analysis.analysis_state === 'processing' ? 'Procesando' :
                       analysis.analysis_state === 'processed' || analysis.analysis_state === 'completed' ? 'Completado' :
                       analysis.analysis_state === 'failed' ? 'Fallido' : analysis.analysis_state}
                    </span>
                  </div>
                  
                  {analysis.contract_type && (
                    <div className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
                      {analysis.contract_type === 'rent' ? 'Arrendamiento' :
                       analysis.contract_type === 'mortgage' ? 'Hipoteca' :
                       analysis.contract_type === 'services' ? 'Servicios' :
                       analysis.contract_type === 'employment' ? 'Empleo' :
                       analysis.contract_type === 'transfers' ? 'Transferencias' : analysis.contract_type}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar for Processing */}
              {(analysis.analysis_state === 'processing' || analysis.analysis_state === 'queued') && 
               analysis.progress_percentage !== undefined && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
                    <span>{analysis.current_step || 'Procesando...'}</span>
                    <span className="font-medium">{analysis.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-full transition-all duration-300 rounded-full bg-primary-600"
                      style={{ width: `${analysis.progress_percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white border-4 rounded-lg" style={{ borderImage: 'linear-gradient(to right, #002D62, #ef4444) 1' }}>
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevious}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasNext}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
