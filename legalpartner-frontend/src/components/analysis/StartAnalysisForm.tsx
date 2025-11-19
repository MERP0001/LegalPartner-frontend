"use client";
import { useState, useEffect } from 'react';
import { listDocuments, startAnalysis } from '@/lib/api';
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling';
import { Button } from '@/components/common/Button';
import type { Document, ContractType } from '@/types';
import { FileText, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StartAnalysisFormProps {
  preSelectedDocumentId?: string;
  onAnalysisComplete?: (analysisId: string) => void;
  onAnalysisFailed?: (error: string) => void;
}

export default function StartAnalysisForm({
  preSelectedDocumentId,
  onAnalysisComplete,
  onAnalysisFailed,
}: StartAnalysisFormProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(preSelectedDocumentId || '');
  const [contractType, setContractType] = useState<ContractType | ''>('');
  const [loading, setLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Polling hook for analysis status
  const { analysis, isPolling, startPolling } = useAnalysisPolling({
    analysisId: currentAnalysisId,
    enabled: !!currentAnalysisId,
    onComplete: (completedAnalysis) => {
      setSuccessMessage(`¡Análisis completado! ID: ${completedAnalysis.analysis_id}`);
      setLoading(false);
      onAnalysisComplete?.(completedAnalysis.analysis_id);
    },
    onFailed: (failedAnalysis) => {
      const errorMsg = failedAnalysis.error_message || 'El análisis falló';
      setError(errorMsg);
      setLoading(false);
      onAnalysisFailed?.(errorMsg);
    },
    onProgress: (progressAnalysis) => {
      // Update progress if available
      console.log('Analysis progress:', progressAnalysis.progress_percentage);
    },
  });

  // Load documents on mount
  useEffect(() => {
    const loadDocs = async () => {
      try {
        setLoadingDocs(true);
        const res = await listDocuments({ document_status: 'processed' });
        if (res.success && res.data) {
          setDocuments(res.data || []);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.error('Error loading documents:', err);
        setDocuments([]);
      } finally {
        setLoadingDocs(false);
      }
    };
    loadDocs();
  }, []);

  // Set pre-selected document
  useEffect(() => {
    if (preSelectedDocumentId) {
      setSelectedDocumentId(preSelectedDocumentId);
    }
  }, [preSelectedDocumentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocumentId) {
      setError('Por favor selecciona un documento');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await startAnalysis(
        selectedDocumentId,
        contractType || undefined
      );

      if (res.success && res.data?.analysis_id) {
        setCurrentAnalysisId(res.data.analysis_id);
        startPolling();
        setSuccessMessage(`Análisis iniciado. ID: ${res.data.analysis_id}`);
      } else {
        setError(res.error || res.message || 'No se pudo iniciar el análisis');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error starting analysis:', err);
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!analysis) return 0;
    return analysis.progress_percentage || 0;
  };

  const getCurrentStep = () => {
    if (!analysis) return 'Iniciando...';
    return analysis.current_step || 'Procesando análisis...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Iniciar Análisis de Contrato</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Selector */}
        <div>
          <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
            Documento a analizar
          </label>
          {loadingDocs ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando documentos...
            </div>
          ) : documents.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">
              No hay documentos procesados disponibles
            </div>
          ) : (
            <select
              id="document"
              value={selectedDocumentId}
              onChange={(e) => setSelectedDocumentId(e.target.value)}
              disabled={loading || isPolling}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">Selecciona un documento</option>
              {documents.map((doc) => (
                <option key={doc.document_id} value={doc.document_id}>
                  {doc.original_filename} ({doc.contract_type_display || 'Sin tipo'})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Contract Type Selector */}
        <div>
          <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de contrato
          </label>
          <select
            id="contractType"
            value={contractType}
            onChange={(e) => setContractType(e.target.value as ContractType | '')}
            disabled={loading || isPolling}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">General</option>
            <option value="rent">Arrendamiento</option>
            <option value="mortgage">Hipoteca</option>
            <option value="services">Servicios</option>
            <option value="employment">Empleo</option>
            <option value="transfers">Transferencias</option>
          </select>
        </div>

        {/* Progress Bar (shown during analysis) */}
        {isPolling && analysis && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{getCurrentStep()}</span>
              <span className="font-medium text-primary-600">
                {getProgressPercentage()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            {analysis.estimated_time_remaining && (
              <p className="text-xs text-gray-500">
                Tiempo estimado: ~{Math.ceil(analysis.estimated_time_remaining / 60)} min
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && !error && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Info Message */}
        {!loading && !isPolling && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">El análisis puede tardar entre 1-5 minutos</p>
              <p className="text-xs mt-1">
                El progreso se actualizará automáticamente. Puedes cerrar esta pantalla y revisar
                el estado en la sección de Análisis.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || isPolling || loadingDocs || documents.length === 0}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading || isPolling ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isPolling ? 'Analizando...' : 'Iniciando...'}
            </>
          ) : (
            'Iniciar Análisis'
          )}
        </Button>

        {/* View Analysis Button (shown after completion) */}
        {currentAnalysisId && analysis?.analysis_state === 'processed' && (
          <Button
            type="button"
            onClick={() => window.location.href = `/analysis/${currentAnalysisId}`}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Ver Resultados del Análisis
          </Button>
        )}
      </form>
    </div>
  );
}
